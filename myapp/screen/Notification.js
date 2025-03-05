import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Notification() {
  const notifications = [
    {
      id: '1',
      title: 'Booking Confirmed',
      message: 'สนามบาสหนองงูเห่า - Court A',
      time: '13:45',
      date: 'Today',
      status: 'success'
    },
    {
      id: '2',
      title: 'Cancellation Under Review',
      message: 'สนามฟุตบอล - Field B',
      time: '10:30',
      date: 'Yesterday',
      status: 'review'
    },
    {
      id: '3',
      title: 'Refund Successful',
      message: 'Refund for booking at สนามบาสหนองงูเห่า - Court A',
      time: '09:00',
      date: 'Yesterday',
      status: 'refundSuccess'
    },
    {
      id: '4',
      title: 'Cancellation Rejected',
      message: 'Cancellation for booking at สนามฟุตบอล - Field B',
      time: '08:00',
      date: 'Yesterday',
      status: 'rejected'
    },
    {
      id: '5',
      title: 'Refund Failed',
      message: 'Refund for booking at สนามบาสหนองงูเห่า - Court A',
      time: '07:00',
      date: 'Yesterday',
      status: 'refundFailed'
    }
  ];

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
});