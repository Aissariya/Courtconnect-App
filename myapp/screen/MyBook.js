import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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
      const now = new Date(); // เพิ่มการเช็คเวลาปัจจุบัน
      
      if (!currentUser) return;

      console.log('=== Fetching Booking Data ===');

      // ดึงข้อมูล user_id
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return;
      const user_id = userDoc.data().user_id;

      // ดึงข้อมูลการจองและข้อมูล refund พร้อมกัน
      const [bookingSnapshot, refundSnapshot, courtSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'Booking'), where('user_id', '==', user_id))),
        getDocs(query(collection(db, 'Refund'), where('user_id', '==', user_id))),
        getDocs(collection(db, 'Court'))
      ]);

      // เก็บข้อมูล courts พร้อม priceslot
      const courts = {};
      courtSnapshot.forEach(doc => {
        const courtData = doc.data();
        courts[courtData.court_id] = {
          ...courtData,
          priceslot: courtData.priceslot || 500 // ใช้ค่าเริ่มต้น 500 ถ้าไม่มี priceslot
        };
      });

      // เก็บข้อมูล refund ที่มีสถานะ Need Action
      const refundMap = new Map();
      refundSnapshot.forEach(doc => {
        const refundData = doc.data();
        if (refundData.status === 'Need Action') {
          refundMap.set(refundData.booking_id, refundData);
        }
      });

      // แปลงข้อมูล bookings และตรวจสอบกับ refund
      const processedBookings = [];
      bookingSnapshot.forEach(doc => {
        const booking = doc.data();
        const court = courts[booking.court_id];
        
        // แปลง end_time เป็น Date object เพื่อเปรียบเทียบ
        const parseEndTime = (timeStr) => {
          try {
            const [monthDay, yearTime] = timeStr.split(', ');
            const [year, timeStr2] = yearTime.split(' at ');
            const [time, period] = timeStr2.split(' UTC')[0].split(' ');
            const [month, day] = monthDay.split(' ');
            
            const months = {
              January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
              July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
            };
            
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            
            return new Date(parseInt(year), months[month], parseInt(day), hour, parseInt(minutes));
          } catch (error) {
            console.error('Error parsing time:', error);
            return null;
          }
        };

        const endTime = parseEndTime(booking.end_time);
        
        // เพิ่มเข้า list เฉพาะการจองที่ยังไม่สิ้นสุด
        if (endTime && endTime > now) {
          if (court) {
            const refundData = refundMap.get(booking.booking_id);
            const calculatedPrice = calculateBookingPrice(
              booking.start_time, 
              booking.end_time, 
              court.priceslot
            );

            processedBookings.push({
              id: booking.booking_id,
              start_time: booking.start_time,
              end_time: booking.end_time,
              status: refundData ? 'Need Action' : booking.status,
              price: calculatedPrice,
              courtDetails: {
                name: court.field,
                image: court.image[0],
                type: court.court_type,
                address: court.address,
                court_id: court.court_id,
                priceslot: court.priceslot
              }
            });
          }
        }
      });

      console.log('Processed bookings:', processedBookings);
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

  // เพิ่ม useFocusEffect เพื่อรีโหลดข้อมูลอัตโนมัติเมื่อกลับมาที่หน้านี้
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, refreshing data...');
      fetchUserBookings();
      return () => {
        // cleanup เมื่อออกจากหน้า
        console.log('Screen unfocused');
      };
    }, []) // empty dependency array means it runs every time the screen is focused
  );

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
      onPress={() => navigation.navigate("AlreadyBooked", { 
        booking: {
          ...item,
          calculatedPrice: item.price
        }
      })} 
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
        <Text style={styles.text}>Date: {formatDateTime(item.start_time).date}</Text>
        <Text style={styles.text}>Time: {formatDateTime(item.start_time).time} - {formatDateTime(item.end_time).time}</Text>
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
