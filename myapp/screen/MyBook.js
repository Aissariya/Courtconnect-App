import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';

export default function MyBook() {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        // 1. ทดสอบการเชื่อมต่อกับ Firestore
        const courtsRef = collection(db, 'Court');
        const courtDocs = await getDocs(courtsRef);
        
        console.log('=== ทดสอบการเข้าถึงฐานข้อมูล ===');
        console.log('พบสนามทั้งหมด:', courtDocs.size, 'สนาม');
        
        // 2. แสดงข้อมูลสนามทั้งหมด
        courtDocs.forEach(doc => {
          console.log('ID:', doc.id);
          console.log('ข้อมูล:', doc.data());
        });

        // 3. ทดสอบดึงสนาม a01 โดยตรง
        const a01Doc = await getDoc(doc(db, 'Court', 'a01'));
        console.log('=== ทดสอบดึงสนาม a01 ===');
        if (a01Doc.exists()) {
          console.log('พบสนาม a01:', a01Doc.data());
        } else {
          console.log('ไม่พบสนาม a01');
        }

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการทดสอบ:', error);
      }
    };

    testDatabaseConnection();
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);

      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.log('ไม่พบผู้ใช้ที่ล็อกอิน');
        return;
      }

      // ดึงข้อมูลผู้ใช้
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) {
        console.log('ไม่พบข้อมูลผู้ใช้');
        return;
      }

      const userData = userDoc.data();
      console.log('ข้อมูลผู้ใช้:', userData);

      // ดึงข้อมูลการจอง
      const bookingsRef = collection(db, 'Booking');
      const q = query(bookingsRef, where('user_id', '==', userData.user_id));
      const bookingSnapshot = await getDocs(q);

      console.log('จำนวนการจองที่พบ:', bookingSnapshot.size);

      const processedBookings = [];

      // ดึงข้อมูลสนามสำหรับแต่ละการจอง
      for (const bookingDoc of bookingSnapshot.docs) {
        const bookingData = bookingDoc.data();
        console.log('การจองที่พบ:', bookingData);
        console.log('court_id ของการจอง:', bookingData.court_id);

        try {
          const courtRef = doc(db, 'Court', bookingData.court_id);
          console.log('กำลังค้นหาสนาม:', courtRef.path);
          
          const courtSnapshot = await getDoc(courtRef);
          
          if (courtSnapshot.exists()) {
            const courtData = courtSnapshot.data();
            console.log('ข้อมูลสนามที่พบ:', courtData);

            processedBookings.push({
              id: bookingDoc.id,
              ...bookingData,
              courtDetails: {
                name: courtData.field,
                image: courtData.image[0],
                type: courtData.court_type,
                address: courtData.address
              }
            });
          } else {
            console.log('ไม่พบข้อมูลสนาม:', bookingData.court_id);
          }
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสนาม:', error);
        }
      }

      console.log('ข้อมูลการจองที่ประมวลผลแล้ว:', processedBookings);
      setBookings(processedBookings);

    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingCard = ({ item }) => {
    if (!item || !item.courtDetails) {
      console.log('Invalid booking data:', item);
      return null;
    }

    console.log('Rendering booking:', item);
    // แปลงวันที่และเวลาให้อยู่ในรูปแบบที่ต้องการ
    const formatDateTime = (dateTimeStr) => {
      try {
        const [datePart, timePart] = dateTimeStr.split(' at ');
        return {
          date: datePart,
          time: timePart.split(' UTC')[0]
        };
      } catch (error) {
        console.error('Error parsing datetime:', error);
        return { date: 'Invalid date', time: 'Invalid time' };
      }
    };

    const startDateTime = formatDateTime(item.start_time);
    const endDateTime = formatDateTime(item.end_time);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate("AlreadyBooked", { booking: item })}
      >
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'pending' ? "#FFA726" : "#4CAF50" }
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'pending' ? 'รอการยืนยัน' : 'ยืนยันแล้ว'}
          </Text>
        </View>

        <Image 
          source={
            item.courtDetails?.image
              ? { uri: item.courtDetails.image }
              : require('../assets/logo.png')
          }
          style={styles.image}
        />

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.courtDetails?.name || 'ไม่ระบุชื่อสนาม'}</Text>
          <Text style={styles.courtType}>ประเภท: {item.courtDetails?.type || 'ไม่ระบุ'}</Text>
          <Text style={styles.address}>{item.courtDetails?.address || 'ไม่ระบุที่อยู่'}</Text>
          <Text style={styles.text}>วันที่: {startDateTime.date}</Text>
          <Text style={styles.text}>
            เวลา: {startDateTime.time} - {endDateTime.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  courtType: {
    fontSize: 12,
    color: '#009900',
    marginBottom: 4,
    fontWeight: 'bold',
  }
});
