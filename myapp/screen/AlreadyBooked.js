import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import DataComment from '../Model/database_c';
import DataUser from '../Model/database_u';
import { AverageRating } from "../context/AverageRating";
import { checkCommented, handleDeleteComment } from "../context/checkCommented";

export default function AlreadyBooked({ navigation, route }) {
  const [showReason, setShowReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);
  const [commentsState, setComments] = useState([]);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(5);

  const { booking } = route.params || {};
  const auth = getAuth();

  useEffect(() => {
    if (booking) {
      checkRefundStatus();
      fetchComments();
    }
    setIsLoading(false);
  }, [booking]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: 'Invalid date', time: 'Invalid time' };

    try {
      // ตรวจสอบว่าเป็น timestamp จาก Booking Database
      if (dateTime.seconds) {
        const date = new Date(dateTime.seconds * 1000);
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
      }

      // ถ้าเป็น Date object
      if (dateTime instanceof Date) {
        return {
          date: dateTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          time: dateTime.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        };
      }

      console.error('Invalid timestamp format:', dateTime);
      return { date: 'Invalid date', time: 'Invalid time' };
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return { date: 'Invalid date', time: 'Invalid time' };
    }
  };

  const reasons = [
    'Change of plans',
    'Found a better option',
    'Personal reasons',
    'Transportation issues',
    'Health issues',
    'Other',
  ];

  const handleCancel = () => {
    if (selectedReason) {
      setShowConfirmModal(true);
    } else {
      Alert.alert('Please select a reason for cancellation');
    }
  };

  const confirmCancellation = async () => {
    try {
      if (!booking) {
        throw new Error('No booking data available');
      }

      const booking_id = booking.booking_id || booking.id;
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !booking_id) {
        throw new Error('Missing required data');
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      const user_id = userData.user_id;

      // บันทึกข้อมูล refund ด้วย Timestamp
      const refundData = {
        booking_id,
        user_id,
        status: 'Need Action',
        reason_refund: selectedReason,
        datetime_refund: serverTimestamp() // เปลี่ยนเป็น serverTimestamp
      };

      console.log('Saving refund data:', refundData);
      const refundRef = collection(db, 'Refund');
      await addDoc(refundRef, refundData);

      setShowConfirmModal(false);
      setShowReason(false);
      setShowReviewModal(true);

    } catch (error) {
      console.error('Error processing refund:', error);
      Alert.alert('Error', 'Failed to process refund request: ' + error.message);
    }
  };

  // เพิ่มฟังก์ชันตรวจสอบสถานะการยกเลิก
  const checkRefundStatus = async () => {
    if (!booking?.id && !booking?.booking_id) return;

    try {
      const bookingId = booking.booking_id || booking.id;
      const refundsRef = collection(db, 'Refund');
      const q = query(refundsRef,
        where('booking_id', '==', bookingId),
        where('status', '==', 'Need Action')
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setIsRefunded(true);
      }
    } catch (error) {
      console.error('Error checking refund status:', error);
    }
  };

  const fetchComments = async () => {
    if (!booking?.courtDetails?.court_id) return;

    try {
      const commentsRef = collection(db, 'Comment');
      const q = query(commentsRef, where('court_id', '==', booking.courtDetails.court_id));
      const querySnapshot = await getDocs(q);

      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setComments(commentsData);

      const userDataObj = {};
      for (const comment of commentsData) {
        if (comment.user_id) {
          const userDoc = await getDoc(doc(db, 'users', comment.user_id));
          if (userDoc.exists()) {
            userDataObj[comment.id] = userDoc.data();
          }
        }
      }

      setUserData(userDataObj);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const calculateAverageRating = () => {
    if (!commentsState || commentsState.length === 0) return 0;
    const total = commentsState.reduce((sum, comment) => sum + (comment.rating || 0), 0);
    return (total / commentsState.length).toFixed(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsContainer}>
        {booking ? (
          <>
            <Image
              source={{ uri: booking.courtDetails.image }}
              style={styles.mainImage}
              resizeMode="cover"
            />

            <Text style={styles.detailsTitle}>
              {booking.courtDetails.name} ★★★★★ (5.0)
            </Text>

            <View style={[
              styles.priceBox,
              isRefunded && styles.cancelBox // เพิ่มสไตล์สำหรับกรณียกเลิก
            ]}>
              <Text style={[
                styles.priceText,
                isRefunded && styles.cancelText // เพิ่มสไตล์ข้อความสำหรับกรณียกเลิก
              ]}>
                {isRefunded ? 'Cancel' : 'Confirmed'}
              </Text>
            </View>

            <Text style={styles.detailsText}>
              Court Type: {booking.courtDetails.type}{"\n"}
              Date: {formatDateTime(booking.start_time).date}{"\n"}
              Time: {formatDateTime(booking.start_time).time} - {formatDateTime(booking.end_time).time}{"\n"}
              Location: {booking.courtDetails.address}{"\n"}
              Facilities: Locker Room, Shower Room{"\n"}
              Operating Hours: Open Daily 8:00 - 22:00{"\n"}
              Total Price: {booking.price} THB{"\n"} {/* ใช้ราคาที่ส่งมาจาก MyBook */}
            </Text>

            <View style={styles.scoreBar}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.scoreText}>Score</Text>
                <Text style={styles.scoreIcon}>
                  {[...Array(Math.round(calculateAverageRating()))].map((_, index) => (
                    <Text key={index} style={styles.star}>★</Text>
                  ))}
                </Text>
                <Text style={styles.averageRatingText}>({calculateAverageRating()})</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { court_id: booking.courtDetails.court_id })}>
                <Text style={styles.scoreText2}>showmore</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewContainer}>
              {commentsState.length > 0 ? (
                commentsState.slice(0, 3).map((comment) => (
                  <View key={comment.id} style={styles.reviewBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          source={
                            userData[comment.id]?.profileImage
                              ? { uri: userData[comment.id].profileImage }
                              : require("../assets/profile-user.png")
                          }
                          style={styles.profileImage}
                        />
                        <Text style={styles.reviewerName}>{userData[comment.id]?.name || "Loading..."}</Text>
                        <View style={styles.starContainer}>
                          {[...Array(comment.rating)].map((_, index) => (
                            <Text key={index} style={styles.star2}>★</Text>
                          ))}
                        </View>
                        <Text style={styles.rateText}>({comment.rating}.0) </Text>
                      </View>
                      {auth.currentUser && comment.user_id === auth.currentUser.uid && (
                        <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                          <MaterialCommunityIcons
                            name="dots-vertical"
                            size={15}
                            color="#000"
                            style={{ marginTop: 5 }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.dateText}>
                      {comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : "No date"}
                    </Text>
                    <Text style={styles.reviewText}>{comment.text}</Text>
                    <View style={styles.separator} />
                  </View>
                ))
              ) : (
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewText}>No reviews yet.</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>ไม่พบข้อมูลการจอง</Text>
        )}

        {showReason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonTitle}>Select a reason for cancellation</Text>

            <View style={styles.reasonsListContainer}>
              {reasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason ? styles.selectedReason : null
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleCancel}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* แก้ไขเงื่อนไขการแสดงปุ่มด้านล่าง */}
      {!showReason && booking && !isRefunded && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.calanderButton}
            onPress={() => navigation.navigate('MainTab')}
            activeOpacity={1}
          >
            <MaterialCommunityIcons name='home' size={20} color='#000' />
            <Text style={styles.calanderText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.calanderButton}
            onPress={() => navigation.navigate('CalanderScreen')}
            activeOpacity={1}
          >
            <MaterialCommunityIcons name='calendar-outline' size={20} color='#000' />
            <Text style={styles.calanderText}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => setShowReason(true)}
            activeOpacity={1}
          >
            <View style={styles.CancelView}>
              <Text style={styles.CancelText}>Cancel Booking</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Cancellation</Text>
            <Text style={styles.modalText}>
              Are you certain you want to cancel this booking?
            </Text>
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalLabel}>Court:</Text>
              <Text style={styles.modalDetail}>{booking.courtDetails.name}</Text>
            </View>
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalLabel}>Time:</Text>
              <Text style={styles.modalDetail}>{formatDateTime(booking.start_time).time} - {formatDateTime(booking.end_time).time}</Text>
            </View>
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalLabel}>Price:</Text>
              <Text style={styles.modalDetail}>{booking.price}</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmCancellation}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showReviewModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancellation Under Review</Text>
            <Text style={styles.modalText}>
              Your cancellation is under review. If approved, the booking amount will be refunded to your wallet.
            </Text>
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={() => {
                setShowReviewModal(false);
                navigation.navigate('MainTab');
              }}
            >
              <Text style={styles.gotItButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
  },
  mainImage: {
    width: '100%',
    height: 250,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  smallImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    width: '100%',
  },
  smallImage: {
    width: 50,
    height: 50,
    margin: 5,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 70,
  },
  detailsTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
  },
  priceBox: {
    marginTop: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  priceText: {
    color: '#A2F193',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'left',
  },
  scoreBar: {
    flexDirection: 'row',
    backgroundColor: 'black',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  scoreText2: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingRight: 10,
  },
  reviewContainer: {
    marginTop: 20,
    width: '100%',
  },
  reviewBox: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  starContainer: {
    marginTop: -3,
    flexDirection: 'row',
  },
  star: {
    color: 'white',
    fontSize: 18,
    // marginRight: 1,
  },
  star1: {
    color: 'white',
    fontSize: 18,
    marginTop: 5,
  },
  star2: {
    color: 'black',
    fontSize: 18,
    marginTop: 5,
  },
  reasonContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  averageRatingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingLeft: 10,
},
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reasonsListContainer: {
    marginVertical: 10,
  },
  reasonItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  selectedReason: {
    backgroundColor: '#A2F193',
    borderRadius: 5,
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 2,
  },
  calanderButton: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  calanderText: {
    color: 'black',
    fontWeight: 'bold',
  },
  bookingButton: {
    flex: 2,
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 10,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  CancelView: {
    flexDirection: 'row',
    padding: '10'
  },
  CancelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },

  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  modalDetail: {
    fontSize: 16,
    color: '#555',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
  },
  modalButtonConfirm: {
    backgroundColor: '#A2F193',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalButtonTextConfirm: {
    color: 'black',
  },
  gotItButton: {
    marginTop: 20,
    backgroundColor: '#A2F193',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  gotItButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
  cancelBox: {
    backgroundColor: '#FF6B6B', // สีแดงสำหรับสถานะยกเลิก
  },
  cancelText: {
    color: 'white', // สีข้อความเมื่อยกเลิก
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#ddd",
    marginRight: 5,
  },
  rateText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 3,
  },
  dateText: {
    fontSize: 12,
    color: '#333',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 10,
  },
});