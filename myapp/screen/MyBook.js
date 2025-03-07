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
      console.log('Current User ID:', currentUser.uid);

      // ดึงข้อมูลผู้ใช้
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      const bookedCourts = userData.booked_courts || [];
      
      console.log('User Data:', {
        user_id: userData.user_id,
        name: userData.name,
        total_bookings: bookedCourts.length
      });
      
      console.log('Booked Courts:', bookedCourts);

      // ปรับวิธีการดึงข้อมูลสนาม
      const bookingsWithDetails = await Promise.all(
        bookedCourts.map(async (booking) => {
          try {
            // ใช้ court_id โดยตรงในการดึงข้อมูล
            const courtSnapshot = await getDocs(collection(db, 'Court'));
            const courtDoc = courtSnapshot.docs.find(doc => 
              doc.data().court_id === booking.court_id
            );

            if (courtDoc) {
              const courtData = courtDoc.data();
              console.log('Found court:', {
                court_id: booking.court_id,
                name: courtData.field,
                type: courtData.court_type,
                booking_time: booking.booking_time
              });
              return {
                id: booking.court_id,
                start_time: booking.booking_time.start,
                end_time: booking.booking_time.end,
                booked_at: booking.booked_at,
                price: booking.price, // เพิ่มการดึงราคาจาก booked_courts
                courtDetails: {
                  name: courtData.field,
                  image: courtData.image[0],
                  type: courtData.court_type,
                  address: courtData.address
                }
              };
            }
            console.log('Court not found for ID:', booking.court_id);
            return null;
          } catch (error) {
            console.error('Error fetching court details:', error);
            return null;
          }
        })
      );

      const validBookings = bookingsWithDetails.filter(booking => booking !== null);
      console.log('Total valid bookings:', validBookings.length);
      console.log('Valid bookings:', validBookings);
      setBookings(validBookings);

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
      // แยกส่วนวันที่และเวลา
      const [datePart, timePart] = timeStr.split(' at ');
      // ใช้วันที่โดยตรงจาก datePart
      return {
        date: datePart,  // เช่น "March 10, 2025"
        time: timePart.split(' UTC')[0]  // เช่น "10:00 AM"
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
          <Text>ไม่พบการจองสนาม</Text>
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
