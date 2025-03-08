import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export default function Notification() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) return;

        // 1. ดึง booking_id จาก users collection
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) return;

        const bookedIds = userDoc.data().booked_courts || [];
        console.log('Found booked courts:', bookedIds);

        // 2. ดึงข้อมูลการจองจาก Booking collection
        const bookingRef = collection(db, 'Booking');
        const bookingsSnapshot = await getDocs(bookingRef);
        const bookings = {};
        
        bookingsSnapshot.forEach(doc => {
          const bookingData = doc.data();
          if (bookedIds.includes(bookingData.booking_id)) {
            bookings[bookingData.booking_id] = bookingData;
          }
        });

        // 3. ดึงข้อมูลสนามจาก Court collection
        const courtRef = collection(db, 'Court');
        const courtSnapshot = await getDocs(courtRef);
        const courts = {};
        
        courtSnapshot.forEach(doc => {
          const courtData = doc.data();
          courts[courtData.court_id] = courtData;
        });

        // 4. สร้างการแจ้งเตือน
        const notificationsList = await Promise.all(
          Object.values(bookings)
            .filter(booking => booking.status === 'booked')
            .map(async (booking) => {
              const courtData = courts[booking.court_id];

              // แปลงวันที่และเวลาจากรูปแบบ "March 7, 2024 at 10:00 AM UTC+7"
              const parseDateTime = (timeStr) => {
                try {
                  const [datePart, timePart] = timeStr.split(' at ');
                  const [time, period] = timePart.split(' UTC')[0].split(' ');
                  
                  return {
                    date: datePart, // เก็บวันที่ในรูปแบบเดิม
                    time: `${time} ${period}` // เก็บเวลาพร้อม AM/PM
                  };
                } catch (error) {
                  console.error('Error parsing datetime:', error);
                  return { date: '', time: '' };
                }
              };

              const dateTime = parseDateTime(booking.start_time);
              
              return {
                id: booking.booking_id,
                title: 'Booking Confirmed',
                message: `${courtData?.field || 'Unknown Court'}`,
                time: dateTime.time,
                date: dateTime.date,
                status: 'success'
              };
            })
        );

        console.log('Generated notifications:', notificationsList);
        setNotifications(notificationsList);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
      onPress={() => {
        // ส่งข้อมูลการจองไปยังหน้า AlreadyBooked
        navigation.navigate('AlreadyBooked', { 
          booking: {
            id: item.id,
            start_time: item.date + ' at ' + item.time + ' UTC+7',
            end_time: item.date + ' at ' + item.time + ' UTC+7',
            status: 'booked',
            courtDetails: {
              name: item.message,
              image: '', // จะถูกเติมจากการดึงข้อมูลสนาม
              type: '',  // จะถูกเติมจากการดึงข้อมูลสนาม
              address: '' // จะถูกเติมจากการดึงข้อมูลสนาม
            }
          }
        });
      }}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={
              item.status === 'success' ? 'check-circle' :
              item.status === 'review' ? 'clock-outline' :
              item.status === 'refundSuccess' ? 'cash-refund' :
              item.status === 'rejected' ? 'close-circle' :
              'alert-circle'
            }
            size={24}
            color={
              item.status === 'success' ? '#4CAF50' :
              item.status === 'review' ? '#FFD700' :
              item.status === 'refundSuccess' ? '#4CAF50' :
              item.status === 'rejected' ? '#FF6B6B' :
              '#FF0000'
            }
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationDate}>{item.date}</Text>
      <View style={[
        styles.statusIndicator, 
        item.status === 'success' ? styles.statusSuccess :
        item.status === 'review' ? styles.statusReview :
        item.status === 'refundSuccess' ? styles.statusRefundSuccess :
        item.status === 'rejected' ? styles.statusRejected :
        styles.statusRefundFailed
      ]} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#A2F193" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
    borderLeftWidth: 4,
    borderLeftColor: '#A2F193',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
  },
  statusIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 4,
    height: '100%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  statusSuccess: {
    backgroundColor: '#A2F193',
  },
  statusReview: {
    backgroundColor: '#FFD700',
  },
  statusRefundSuccess: {
    backgroundColor: '#4CAF50',
  },
  statusRejected: {
    backgroundColor: '#FF6B6B',
  },
  statusRefundFailed: {
    backgroundColor: '#FF0000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
});