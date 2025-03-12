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

  const formatDateTime = (timestamp) => {
    if (!timestamp?.seconds) return { date: 'Invalid date', time: 'Invalid time' };
    
    try {
      const date = new Date(timestamp.seconds * 1000);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const now = new Date();
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.log("❌ No user logged in");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return;
      
      const user_id = userDoc.data().user_id;
      console.log('Fetching bookings for user:', user_id);

      // ดึงการจองทั้งหมดของ user
      const bookingRef = collection(db, "Booking");
      const userBookingsQuery = query(bookingRef, where("user_id", "==", user_id));
      const bookingSnapshot = await getDocs(userBookingsQuery);

      let bookingList = [];

      for (const docSnap of bookingSnapshot.docs) {
        const booking = docSnap.data();
        const endTime = booking.end_time?.toDate(); // แปลง Timestamp เป็น Date

        // Only add to history if end_time has passed
        if (endTime && endTime < now) {
          const courtQuery = query(
            collection(db, "Court"), 
            where("court_id", "==", booking.court_id)
          );
          const courtSnapshot = await getDocs(courtQuery);

          if (!courtSnapshot.empty) {
            const courtData = courtSnapshot.docs[0].data();
            const formattedStart = formatDateTime(booking.start_time);
            const formattedEnd = formatDateTime(booking.end_time);

            // เพิ่มข้อมูลการจองที่สิ้นสุดแล้วเข้า list
            bookingList.push({
              id: docSnap.id,
              booking_id: booking.booking_id,
              field: courtData.field,
              image: courtData.image[0],
              date: formattedStart.date,
              time: `${formattedStart.time} - ${formattedEnd.time}`,
              price: booking.price || '0'
            });

            console.log('Added past booking:', booking.booking_id);
          }
        }
      }

      console.log(`📌 Total history bookings: ${bookingList.length}`);
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