import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig"; // นำเข้า Firebase
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

function BookingHistory() {
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
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) return;

      // ดึงข้อมูล user_id
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return;
      const user_id = userDoc.data().user_id;

      // ดึงข้อมูล court ทั้งหมดมาเก็บไว้
      const courtsSnapshot = await getDocs(collection(db, 'Court'));
      const courtsData = {};
      courtsSnapshot.forEach(doc => {
        const court = doc.data();
        courtsData[court.court_id] = court;
      });

      // ดึงข้อมูล bookings
      const bookingsRef = collection(db, 'Booking');
      const q = query(bookingsRef, where('user_id', '==', user_id));
      const querySnapshot = await getDocs(q);

      const historyBookings = [];
      const now = new Date();

      querySnapshot.forEach(doc => {
        const booking = doc.data();
        const endTime = booking.end_time.toDate();
        
        // เช็คว่าเป็นการจองที่ผ่านมาแล้ว
        if (endTime < now) {
          const court = courtsData[booking.court_id];
          if (court) {
            // คำนวณราคาจากข้อมูลจริง
            const startTime = booking.start_time.toDate();
            const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
            const price = hours * court.priceslot; // ใช้ราคาจริงจาก court

            historyBookings.push({
              id: booking.booking_id,
              courtName: court.field,
              courtImage: court.image[0],
              date: startTime,
              startTime: startTime,
              endTime: endTime,
              price: price,
              status: booking.status
            });
          }
        }
      });

      // เรียงตามวันที่ล่าสุด
      historyBookings.sort((a, b) => b.date - a.date);
      setBookings(historyBookings);

    } catch (error) {
      console.error('Error fetching booking history:', error);
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
  
  const renderBookingCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.courtImage }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.courtName}</Text>
        <Text style={styles.text}>
          Date: {item.startTime.toLocaleDateString()}
        </Text>
        <Text style={styles.text}>
          Time: {item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          - {item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.price}>Price: {item.price} THB</Text>
      </View>
    </View>
  );

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
          renderItem={renderBookingCard}
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

export default BookingHistory;