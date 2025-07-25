import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getDocs, collection, updateDoc, arrayRemove, query, where } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';

const MyBook = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const calculateBookingPrice = (startTime, endTime, courtPrice) => {
    try {
      // แยกเวลาออกจาก timestamp
      const parseTime = (timeStr) => {
        const [datePart, timePart] = timeStr.split(' at ');
        const [time, period] = timePart.split(' UTC')[0].split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        
        // แปลงเวลาเป็น 24 ชั่วโมง
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        return { hour, minutes: parseInt(minutes) };
      };

      const start = parseTime(startTime);
      const end = parseTime(endTime);

      // คำนวณจำนวนชั่วโมง
      let totalHours;
      if (end.hour < start.hour) {
        totalHours = (24 - start.hour) + end.hour;
      } else {
        totalHours = end.hour - start.hour;
      }

      // ปรับลดหากมีเศษนาที
      if (end.minutes < start.minutes) {
        totalHours--;
      }

      // ใช้ราคาต่อชั่วโมงจาก Court (priceslot)
      return totalHours * courtPrice;
    } catch (error) {
      console.error('Error calculating price:', error);
      return 0;
    }
  };

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      // 1. ดึง user_id
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return;
      const user_id = userDoc.data().user_id;

      // 2. ดึงข้อมูลสนาม refund และ booking พร้อมกัน
      const [bookingSnapshot, refundSnapshot, courtSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'Booking'), where('user_id', '==', user_id))),
        getDocs(collection(db, 'Refund')),
        getDocs(collection(db, 'Court'))
      ]);

      // เก็บข้อมูล courts
      const courts = {};
      courtSnapshot.forEach(doc => {
        const courtData = doc.data();
        courts[courtData.court_id] = {
          ...courtData,
          priceslot: courtData.priceslot || 500
        };
      });

      // เก็บข้อมูล Refund status
      const refundMap = new Map();
      refundSnapshot.forEach(doc => {
        const refundData = doc.data();
        refundMap.set(refundData.booking_id, refundData.status);
      });

      const now = new Date();
      const processedBookings = [];

      // กรองและแปลงข้อมูล bookings
      bookingSnapshot.forEach(doc => {
        const booking = doc.data();
        const court = courts[booking.court_id];
        const refundStatus = refundMap.get(booking.booking_id);
        
        // ไม่รวมการจองที่มี Refund status เป็น Accepted
        if (refundStatus !== 'Accepted' && court) {
          // แปลง Timestamp เป็น Date
          const startTime = booking.start_time.toDate();
          const endTime = booking.end_time.toDate();
          
          // คำนวณจำนวนชั่วโมงและราคา
          const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
          const price = hours * court.priceslot;

          if (endTime > now) { // แสดงเฉพาะการจองที่ยังไม่สิ้นสุด
            processedBookings.push({
              id: booking.booking_id,
              start_time: startTime,
              end_time: endTime,
              status: refundStatus === 'Need Action' ? 'Need Action' : 
                     refundStatus === 'Rejected' ? 'Confirmed' : 
                     booking.status,
              price: price,
              courtDetails: {
                name: court.field,
                image: court.image[0],
                type: court.court_type,
                address: court.address,
                court_id: court.court_id
              }
            });
          }
        }
      });

      // เรียงตามวันที่
      processedBookings.sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
      setBookings(processedBookings);

    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserBookings().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const formatDateTime = (timeStr) => {
    try {
      if (!timeStr) return { date: 'Invalid date', time: 'Invalid time' };
      
      // แยกวันและเวลา เช่น "March 7, 2024 at 10:00 AM UTC+7"
      const [monthDay, yearAndTime] = timeStr.split(', ');
      const [year, timeWithZone] = yearAndTime.split(' at ');
      const [time, period] = timeWithZone.split(' UTC')[0].split(' ');

      return {
        date: `${monthDay}, ${year}`,
        time: `${time} ${period}`
      };
    } catch (error) {
      console.error('Error parsing datetime:', error, 'for string:', timeStr);
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("AlreadyBooked", { booking: item })} 
      style={styles.card}
    >
      <View style={[
        styles.statusBadge,
        { backgroundColor: item.status === 'Need Action' ? '#FF6B6B' : '#A2F193' }
      ]}>
        <Text style={[
          styles.statusText,
          { color: item.status === 'Need Action' ? 'white' : 'black' }
        ]}>
          {item.status === 'Need Action' ? 'Cancel' : 'Booked'}
        </Text>
      </View>
      <Image source={{ uri: item.courtDetails.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.courtDetails.name}</Text>
        <Text style={styles.text}>
          Date: {item.start_time.toLocaleDateString()}
        </Text>
        <Text style={styles.text}>
          Time: {item.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          - {item.end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.price}>Price: {item.price} THB</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#009900"]} // สีเขียวตามธีมแอพ
              tintColor="#009900"
            />
          }
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text>Field reservation not found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative", 
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#009900",
    marginTop: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default MyBook;
