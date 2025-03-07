import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';

export default function MyBook() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchUserBookings();
  }, []);

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("AlreadyBooked", { court_id: item.id })} 
      style={styles.card}
    >
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Upcoming</Text>
      </View>
      <Image source={{ uri: item.courtDetails.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.courtDetails.name}</Text>
        <Text style={styles.text}>Date: {item.booked_at}</Text>
        <Text style={styles.text}>Time: {item.start_time} - {item.end_time}</Text>
        <Text style={styles.price}>Price: 200 THB</Text>
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
    backgroundColor: "#FFA726",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
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
