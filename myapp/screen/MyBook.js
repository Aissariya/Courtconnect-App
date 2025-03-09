import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getDocs, collection, updateDoc, arrayRemove } from 'firebase/firestore';
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

      console.log('=== Fetching User Booking Data ===');

      // 1. ดึงข้อมูล booking_id จาก users collection
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return;

      let bookedIds = userDoc.data().booked_courts || [];
      console.log('Found booked_courts:', bookedIds);

      // 2. ดึงข้อมูลการจองทั้งหมดจาก Booking collection
      const bookingRef = collection(db, 'Booking');
      const bookingsSnapshot = await getDocs(bookingRef);
      const allBookings = {};
      const validBookingIds = new Set();
      
      bookingsSnapshot.forEach(doc => {
        const bookingData = doc.data();
        allBookings[bookingData.booking_id] = bookingData;
        validBookingIds.add(bookingData.booking_id);
      });

      // 3. ตรวจสอบและลบ booking_id ที่ไม่มีอยู่จริง
      const invalidBookingIds = bookedIds.filter(id => !validBookingIds.has(id));
      if (invalidBookingIds.length > 0) {
        console.log('Found invalid booking IDs:', invalidBookingIds);
        
        // ลบ booking_id ที่ไม่มีอยู่จริงออกจาก users collection
        const userRef = doc(db, "users", currentUser.uid);
        for (const invalidId of invalidBookingIds) {
          await updateDoc(userRef, {
            booked_courts: arrayRemove(invalidId)
          });
          console.log('Removed invalid booking ID:', invalidId);
        }
        
        // อัพเดต bookedIds หลังจากลบ
        bookedIds = bookedIds.filter(id => validBookingIds.has(id));
      }

      // 4. ดึงข้อมูลสนามจาก Court collection และเก็บ priceslot
      const courtRef = collection(db, 'Court');
      const courtSnapshot = await getDocs(courtRef);
      const courts = {};
      
      courtSnapshot.forEach(doc => {
        const courtData = doc.data();
        courts[courtData.court_id] = {
          ...courtData,
          priceslot: courtData.priceslot || 500 // ใช้ค่าเริ่มต้น 500 ถ้าไม่มี priceslot
        };
      });

      // 5. รวมข้อมูลทั้งหมดพร้อมคำนวณราคา
      const bookingsWithDetails = bookedIds.map(bookingId => {
        const bookingData = allBookings[bookingId];
        if (!bookingData) return null;

        const courtData = courts[bookingData.court_id];
        if (!courtData) return null;

        const calculatedPrice = calculateBookingPrice(
          bookingData.start_time, 
          bookingData.end_time, 
          courtData.priceslot
        );

        return {
          id: bookingId,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          price: calculatedPrice,
          status: bookingData.status,
          people: bookingData.people,
          courtDetails: {
            name: courtData.field,
            image: courtData.image[0],
            type: courtData.court_type,
            address: courtData.address
          }
        };
      }).filter(booking => booking !== null);

      console.log('Final processed bookings:', bookingsWithDetails);
      setBookings(bookingsWithDetails);

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
