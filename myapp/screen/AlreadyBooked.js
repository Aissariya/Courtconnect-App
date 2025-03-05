import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AlreadyBooked({ navigation }) {
  const [showReason, setShowReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const bookingDetails = {
    bookingId: '12345',
    courtName: 'Court A',
    bookingTime: '10:00 AM - 11:00 AM',
    bookingDate: '2025-03-05',
    mainImage: require('../assets/pingpong.jpg'),
    subImages: [
      require('../assets/pingpong.jpg'),
      require('../assets/pingpong.jpg'),
    ],
    price: '500',
    courtType: 'Indoor',
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

  const confirmCancellation = () => {
    setShowConfirmModal(false);
    setShowReason(false);
    setShowReviewModal(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsContainer}>
        <Image
          source={bookingDetails.mainImage}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.smallImagesContainer}>
            {bookingDetails.subImages.map((imageUri, index) => (
              <TouchableOpacity key={index}>
                <Image
                  source={imageUri}
                  style={styles.smallImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.detailsTitle}>{bookingDetails.courtName} ★★★★★ (5.0)</Text>

        <View style={styles.priceBox}>
          <Text style={styles.priceText}> Already Booked</Text>
        </View>

        <Text style={styles.detailsText}>
          Field type: {bookingDetails.courtType}{"\n"}
          Booking Time: {bookingDetails.bookingTime}{"\n"}
          Booking Date: {bookingDetails.bookingDate}{"\n"}
          Facilities: locker room, shower room{"\n"}
          Business hours: Open every day 8:00 - 14:00{"\n"}
          Terms and conditions:{"\n"}
          - Users must follow the rules and regulations of the field.{"\n"}
          - If you want to cancel your reservation, you should notify in advance according to the specified period.{"\n"}
          - Use of the field must be careful to ensure the safety of all players.{"\n"}
          Payment: Can pay through various channels
        </Text>

        {!showReason && (
          <>
            <View style={styles.scoreBar}>
              <Text style={styles.scoreText}>Score ★★★★★ (5.0)</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CommentScreen')}>
                <Text style={styles.scoreText2}>showmore</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewContainer}>
              <View style={styles.reviewBox}>
                <Text style={styles.reviewerName}>John Doe</Text>
                <Text style={styles.reviewText}>สนามบาสดีมาก บรรยากาศเยี่ยม และการดูแลรักษาสนามดีเยี่ยม</Text>
                <View style={styles.starContainer}>
                  {[...Array(5)].map((_, index) => (
                    <Text key={index} style={styles.star}>★</Text>
                  ))}
                </View>
              </View>

              <View style={styles.reviewBox}>
                <Text style={styles.reviewerName}>Jane Smith</Text>
                <Text style={styles.reviewText}>สนามบาสสะอาดและมีอุปกรณ์ครบครัน สะดวกสบายมากๆ</Text>
                <View style={styles.starContainer}>
                  {[...Array(4)].map((_, index) => (
                    <Text key={index} style={styles.star}>★</Text>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        {showReason && (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonTitle}>Select a reason for cancellation</Text>
            <Picker
              selectedValue={selectedReason}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedReason(itemValue)}
            >
              {reasons.map((reason, index) => (
                <Picker.Item key={index} label={reason} value={reason} />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleCancel}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {!showReason && (
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
              <Text style={styles.modalDetail}>{bookingDetails.courtName}</Text>
            </View>
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalLabel}>Time:</Text>
              <Text style={styles.modalDetail}>{bookingDetails.bookingTime}</Text>
            </View>
            <View style={styles.modalDetailsContainer}>
              <Text style={styles.modalLabel}>Price:</Text>
              <Text style={styles.modalDetail}>{bookingDetails.price}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    fontSize: 18,
    marginRight: 3,
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
  reasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
    fontSize:15,
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
    marginTop : 10,
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
});