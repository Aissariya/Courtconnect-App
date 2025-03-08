import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';

export default function MyBook() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      const bookedIds = userDoc.data().booked_courts || [];
      console.log('Found booked_courts:', bookedIds);

      // 2. ดึงข้อมูลการจองจาก Booking collection
      const bookingRef = collection(db, 'Booking');
      const bookingsSnapshot = await getDocs(bookingRef);
      const allBookings = {};
      
      bookingsSnapshot.forEach(doc => {
        const bookingData = doc.data();
        if (bookedIds.includes(bookingData.booking_id)) {
          allBookings[bookingData.booking_id] = bookingData;
        }
      });

      console.log('Matched bookings:', allBookings);

      // 3. ดึงข้อมูลสนามจาก Court collection
      const courtRef = collection(db, 'Court');
      const courtSnapshot = await getDocs(courtRef);
      const courts = {};
      
      courtSnapshot.forEach(doc => {
        const courtData = doc.data();
        courts[courtData.court_id] = courtData;
      });

      // 4. รวมข้อมูลทั้งหมด
      const bookingsWithDetails = bookedIds.map(bookingId => {
        const bookingData = allBookings[bookingId];
        if (!bookingData) return null;

        const courtData = courts[bookingData.court_id];
        if (!courtData) return null;

        return {
          id: bookingId,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          price: bookingData.price,
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
      
      // รองรับทั้งรูปแบบที่มี 'at' และไม่มี
      if (timeStr.includes(' at ')) {
        const [datePart, timePart] = timeStr.split(' at ');
        return {
          date: datePart,
          time: timePart.split(' UTC')[0]
        };
      } else {
        // รูปแบบใหม่: "March 9, 2025, 12:00 PM UTC+7"
        const [datePart, timePart] = timeStr.split(', ').slice(-2);
        return {
          date: timeStr.split(', ').slice(0, -1).join(', '), // เอาส่วนวันที่ทั้งหมด
          time: timePart.split(' UTC')[0] // เอาเฉพาะเวลา
        };
      }
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
          status: "booked",
          people: 5
        }
      })} 
      style={styles.card}
    >
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Booked</Text>
      </View>
      <Image source={{ uri: item.courtDetails.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.courtDetails.name}</Text>
        <Text style={styles.text}>Date: {formatDateTime(item.start_time).date}</Text>
        <Text style={styles.text}>Time: {formatDateTime(item.start_time).time} - {formatDateTime(item.end_time).time}</Text>
        <Text style={styles.price}>Price: {item.price || '500'} THB</Text>
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
    backgroundColor: "#A2F193", // เปลี่ยนจาก #FFA726 เป็น #A2F193
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black", // เปลี่ยนจาก white เป็น black เพื่อให้เห็นชัดบนพื้นสีเขียว
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
