import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig"; // นำเข้า Firebase
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ฟังก์ชันแปลง String เป็น Date()
  const parseBookingTime = (timeStr) => {
    try {
      const [monthDay, yearTime] = timeStr.split(", ");
      const [year, timeStr2] = yearTime.split(" at ");
      const [time, period] = timeStr2.split(" UTC")[0].split(" ");
      const [month, day] = monthDay.split(" ");

      // แปลงชื่อเดือนเป็นตัวเลข
      const months = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
      };

      // แยกชั่วโมงและนาที
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours);

      // แปลงเป็น 24 ชั่วโมง
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return new Date(parseInt(year), months[month], parseInt(day), hour, parseInt(minutes));
    } catch (error) {
      console.error("❌ Error parsing time:", timeStr, error);
      return null;
    }
  };

  const parseDateOnly = (timeStr) => {
    try {
      return timeStr.split(" at ")[0]; // แยกเอาเฉพาะส่วน "March 10, 2025"
    } catch (error) {
      console.error("❌ Error parsing date:", timeStr, error);
      return "Invalid Date";
    }
  };
  
  // ฟังก์ชันดึงเฉพาะเวลา "02:00 PM"
  const parseTimeOnly = (timeStr) => {
    try {
      return timeStr.split(" at ")[1].split(" UTC")[0]; // แยกเอาเฉพาะเวลา เช่น "02:00 PM"
    } catch (error) {
      console.error("❌ Error parsing time:", timeStr, error);
      return "Invalid Time";
    }
  };

  const calculateBookingPrice = (startTime, endTime, courtPrice) => {
    try {
      const parseTime = (timeStr) => {
        const [datePart, timePart] = timeStr.split(' at ');
        const [time, period] = timePart.split(' UTC')[0].split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        return { hour, minutes: parseInt(minutes) };
      };

      const start = parseTime(startTime);
      const end = parseTime(endTime);

      let totalHours;
      if (end.hour < start.hour) {
        totalHours = (24 - start.hour) + end.hour;
      } else {
        totalHours = end.hour - start.hour;
      }

      if (end.minutes < start.minutes) {
        totalHours--;
      }

      return totalHours * courtPrice;
    } catch (error) {
      console.error('Error calculating price:', error);
      return 0;
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const now = new Date();
      
      // 1. ดึง user_id จาก user ที่ล็อกอิน
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('No user logged in');
        return;
      }

      // 2. ดึง user_id จาก users collection
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) {
        console.log('User document not found');
        return;
      }
      const user_id = userDoc.data().user_id;

      // 3. ดึงการจองของ user นี้
      const bookingRef = collection(db, "Booking");
      const userBookingsQuery = query(bookingRef, where("user_id", "==", user_id));
      const bookingSnapshot = await getDocs(userBookingsQuery);

      let bookingList = [];
      console.log(`Found ${bookingSnapshot.size} bookings for user ${user_id}`);

      for (const docSnap of bookingSnapshot.docs) {
        const bookingData = docSnap.data();
        const endTime = parseBookingTime(bookingData.end_time);
        if (!endTime) continue;

        // 4. เช็คว่าการจองสิ้นสุดแล้วหรือยัง
        if (endTime < now) {
          console.log('Processing ended booking:', bookingData.booking_id);
          
          // 5. ดึงข้อมูลสนามจาก Court collection
          const courtQuery = query(
            collection(db, "Court"), 
            where("court_id", "==", bookingData.court_id)
          );
          const courtSnapshot = await getDocs(courtQuery);

          if (!courtSnapshot.empty) {
            const courtData = courtSnapshot.docs[0].data();
            const courtImage = courtData.image?.[0] || null;

            // คำนวณราคา
            const calculatedPrice = calculateBookingPrice(
              bookingData.start_time,
              bookingData.end_time,
              courtData.priceslot || 500
            );

            bookingList.push({
              id: docSnap.id,
              booking_id: bookingData.booking_id,
              field: courtData.field || "Unknown Field",
              image: courtImage,
              date: parseDateOnly(bookingData.start_time),
              time: `${parseTimeOnly(bookingData.start_time)} - ${parseTimeOnly(bookingData.end_time)}`,
              price: calculatedPrice,
            });

            console.log('Added booking to history:', bookingData.booking_id);
          }
        }
      }

      console.log(`Total history bookings: ${bookingList.length}`);
      setBookings(bookingList);
    } catch (error) {
      console.error("❌ Error fetching booking history:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookingHistory().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('History screen focused, refreshing data...');
      fetchBookingHistory();
      return () => {
        console.log('History screen unfocused');
      };
    }, [])
  );

  useEffect(() => {
    fetchBookingHistory();
  }, []);
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#009900" />
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingText}>No booking history available.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#009900"]}
              tintColor="#009900"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.field}</Text>
                <Text style={styles.text}>Date: {item.date}</Text>
                <Text style={styles.text}>Time: {item.time}</Text>              
                <Text style={styles.price}>Price: {item.price} THB</Text>
              </View>
              <View style={[styles.statusContainer, styles.completed]}>
                <Text style={styles.statusText}>Ended</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
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
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#009900",
    marginTop: 5,
  },
  statusContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#878787",
  },
  completed: {
    backgroundColor: "#dcdcdc",
  },
  noBookingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  imageWrapper: {
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    overflow: 'hidden',
    width: 80,
    height: 80,
    marginRight: 15,
  },
  grayScale: {
    opacity: 0.6,
    tintColor: '#808080',
  },
  placeholderImage: {
    backgroundColor: '#E0E0E0',
  },
});
