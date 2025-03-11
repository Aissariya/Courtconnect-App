import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) return;
        const userData = userDoc.data();
        const user_id = userData.user_id;

        // ดึงข้อมูล Refund ที่มีสถานะ Need Action
        const refundsSnapshot = await getDocs(
          query(collection(db, 'Refund'), 
            where('status', '==', 'Need Action'),
            where('user_id', '==', user_id)
          )
        );

        console.log('Found refunds:', refundsSnapshot.size);

        // สร้าง array เก็บ notifications
        const notifications = [];
        for (const doc of refundsSnapshot.docs) {
          const refundData = doc.data();
          console.log('Processing refund:', refundData);

          // ดึงข้อมูล booking เพื่อหา court_id
          const bookingsSnapshot = await getDocs(
            query(collection(db, 'Booking'), 
              where('booking_id', '==', refundData.booking_id)
            )
          );

          if (!bookingsSnapshot.empty) {
            const bookingData = bookingsSnapshot.docs[0].data();
            
            // ดึงข้อมูลสนามจาก court_id
            const courtSnapshot = await getDocs(
              query(collection(db, 'Court'),
                where('court_id', '==', bookingData.court_id)
              )
            );

            if (!courtSnapshot.empty) {
              const courtData = courtSnapshot.docs[0].data();
              console.log('Found court:', courtData.field);

              notifications.push({
                id: refundData.booking_id,
                title: 'Cancellation Under Review',
                message: `${courtData.field}`,
                time: new Date(refundData.datetime_refund.seconds * 1000).toLocaleTimeString(),
                date: new Date(refundData.datetime_refund.seconds * 1000).toLocaleDateString(),
                status: 'review',
                timestamp: refundData.datetime_refund.seconds * 1000,
                reason: refundData.reason_refund
              });
            }
          }
        }

        // เรียงตามเวลาล่าสุด
        notifications.sort((a, b) => b.timestamp - a.timestamp);
        console.log('Final notifications:', notifications.length);
        setNotifications(notifications);

      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Add helper functions for formatting
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const parseDateTime = (timeStr) => {
    if (!timeStr) return { date: '', time: '' };
    const [datePart, timePart] = timeStr.split(' ');
    return {
      date: formatDate(datePart),
      time: formatTime(timePart)
    };
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
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
    </View>
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