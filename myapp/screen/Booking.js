import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Modal, Button, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

const App = ({ navigation, route }) => {
  const { court } = route.params || {};
  const [hourStart, setHourStart] = useState("12");
  const [minuteStart, setMinuteStart] = useState("00");
  const [hourEnd, setHourEnd] = useState("14");
  const [minuteEnd, setMinuteEnd] = useState("00");
  const [showStartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setShowEndTimeModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [numPeople, setNumPeople] = useState("1"); // เปลี่ยนเป็น string
  const [showImageModal, setShowImageModal] = useState(false);
  const { getAuth } = require('firebase/auth'); // เพิ่ม import getAuth

  const handleConfirm = () => {
    if (validateBooking()) {
      setShowConfirmModal(true);
    }
  };

  const handleFinalConfirm = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Generate booking ID
      const booking_id = `BK${Date.now()}`;

      // Create start time date object
      const startDate = new Date(date);
      startDate.setHours(parseInt(hourStart), parseInt(minuteStart));
      
      // Create end time date object
      const endDate = new Date(date);
      endDate.setHours(parseInt(hourEnd), parseInt(minuteEnd));

      // Format the times without seconds
      const startTime = startDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bangkok'
      }) + ' UTC+7';

      const endTime = endDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bangkok'
      }) + ' UTC+7';

      // Create booking data with people count and user_id
      const bookingData = {
        booking_id: booking_id,
        court_id: court.court_id,
        end_time: endTime,
        start_time: startTime,
        status: "pending",
        user_id: currentUser.uid,
        people: parseInt(numPeople) // เพิ่มจำนวนคน
      };

      // Add to Firestore Booking collection
      const bookingRef = collection(db, 'Booking');
      await addDoc(bookingRef, bookingData);

      // Close confirm modal first
      setShowConfirmModal(false);
      
      // Show success animation
      setShowSuccess(true);

      // Wait for 2 seconds before navigating
      setTimeout(() => {
        setShowSuccess(false);
        navigation.navigate('MainTab');
      }, 2000);

    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Failed to create booking: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessPress = () => {
    setShowSuccess(false);
    navigation.navigate('MainTab');
  };

  // ฟังก์ชันคำนวณราคา
  const calculatePrice = (hStart, mStart, hEnd, mEnd) => {
    const startMinutes = parseInt(hStart) * 60 + parseInt(mStart);
    const endMinutes = parseInt(hEnd) * 60 + parseInt(mEnd);

    if (endMinutes <= startMinutes) {
      alert('End time must be after start time');
      setTotalPrice(0);
      return;
    }

    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.ceil(diffMinutes / 60); // Always round up to nearest hour
    const price = hours * 500;
    
    setTotalPrice(price);
    return price;
  };

  // ฟังก์ชัน validateBooking
  const validateBooking = () => {
    if (!date) {
      alert('Please select a date');
      return false;
    }

    const startTime = parseInt(hourStart) * 60 + parseInt(minuteStart);
    const endTime = parseInt(hourEnd) * 60 + parseInt(minuteEnd);
    
    if (endTime <= startTime) {
      alert('End time must be after start time');
      return false;
    }

    if (totalPrice === 0) {
      alert('Please calculate price first');
      return false;
    }

    return true;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight for comparison
    
    if (currentDate < today) {
      alert('Cannot select past dates');
      return;
    }
    
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const handleImagePress = () => {
    setShowImageModal(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* หัวข้อ Booking ตรงกลาง */}
        <Text style={styles.header}>Booking</Text>

        {/* การ์ดข้อมูลสนาม */}
        <View style={styles.card}>
          {court && (
            <Image source={{ uri: court.image[0] }} style={styles.courtImage} />
          )}
          <View style={styles.courtDetails}>
            <Text style={styles.courtTitle}>{court ? court.field : 'Loading...'}</Text>
            <Text style={styles.courtSubtitle}>{court ? court.address : 'Loading...'}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{court ? court.address : 'Loading...'}</Text>

          <Text style={styles.label}>Date</Text>
          
          {/* ช่องกรอกวันที่ */}
          <View style={styles.dateInputContainer}>
            <AntDesign name="calendar" size={18} color="black" style={styles.calendarIcon} />
            <TouchableOpacity onPress={showDatepicker} style={{ flex: 1 }}>
              <TextInput 
                style={styles.dateInput} 
                placeholder="Select date" 
                value={date ? date.toLocaleDateString() : ''} 
                editable={false} 
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Text style={styles.label}>Time</Text>

          {/* Start Time Picker */}
          <View style={styles.timePickerContainer}>
            <Picker selectedValue={hourStart} onValueChange={(itemValue) => setHourStart(itemValue)} style={styles.picker}>
              {[...Array(24).keys()].map(i => <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />)}
            </Picker>
            <Picker selectedValue={minuteStart} onValueChange={(itemValue) => setMinuteStart(itemValue)} style={styles.picker}>
              {[...Array(60).keys()].map(i => <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />)}
            </Picker>
          </View>

          {/* End Time Picker */}
          <View style={styles.timePickerContainer}>
            <Picker selectedValue={hourEnd} onValueChange={(itemValue) => setHourEnd(itemValue)} style={styles.picker}>
              {[...Array(24).keys()].map(i => <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />)}
            </Picker>
            <Picker selectedValue={minuteEnd} onValueChange={(itemValue) => setMinuteEnd(itemValue)} style={styles.picker}>
              {[...Array(60).keys()].map(i => <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />)}
            </Picker>
          </View>

          {/* จำนวนคน */}
          <Text style={styles.label}>Number of People</Text>
          <View style={styles.numPeopleContainer}>
            <Picker selectedValue={numPeople} onValueChange={(itemValue) => setNumPeople(String(itemValue))} style={styles.picker}>
              {[...Array(15).keys()].map(i => <Picker.Item key={i} label={String(i + 1)} value={String(i + 1)} />)}
            </Picker>
          </View>

          {/* คำนวณราคา */}
          <TouchableOpacity onPress={() => calculatePrice(hourStart, minuteStart, hourEnd, minuteEnd)} style={styles.calculateButton}>
            <Text style={styles.calculateButtonText}>Calculate Price</Text>
          </TouchableOpacity>

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total ({totalPrice / 500} hrs.)</Text>
            <Text style={styles.priceText}>{totalPrice} BATH</Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.paymentMethod}>
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={require('../assets/Qrcode.jpg')} style={styles.paymentIcon} />
            </TouchableOpacity>
            <View style={styles.walletContainer}>
              <Ionicons name="wallet-outline" size={32} color="black" />
              <View>
                <Text style={styles.walletText}>My Wallet</Text>
                <Text style={styles.walletBalance}>0.00 Bath</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* แสดงราคา*/}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{totalPrice} Bath</Text>
       {/* ปุ่มยืนยัน*/}
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>

      {/* Modal ยืนยัน */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>ARE YOU SURE?</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={{ backgroundColor: 'black', padding: 10, margin: 5, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFinalConfirm} style={{ backgroundColor: 'green', padding: 10, margin: 5, borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>CONFIRM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ไอคอนติ๊กถูก */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity onPress={handleSuccessPress} style={{ alignItems: 'center' }}>
            <Image source={require('../assets/check.png')} style={{ width: 150, height: 150, marginTop: 20 }} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal แสดงรูปขยาย */}
      <Modal transparent visible={showImageModal} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity onPress={() => setShowImageModal(false)} style={{ alignItems: 'center' }}>
            <Image source={require('../assets/Qrcode.jpg')} style={{ width: 300, height: 300 }} />
          </TouchableOpacity>
        </View>
      </Modal>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
}

App.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Something went wrong. Please try again.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Wrap the main component
export default function BookingWrapper({ navigation, route }) {
  return (
    <ErrorBoundary>
      <App navigation={navigation} route={route} />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  courtImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  courtDetails: {
    marginTop: 10,
  },
  courtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009900',
  },
  courtSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009900', // สีเขียว
    marginBottom: 5,
    marginHorizontal: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  picker: {
    width: '45%',
  },
  numPeopleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  calculateButton: {
    backgroundColor: '#A2F193',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009900',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletBalance: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
  },
  priceContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#A5F59C', // สีเขียวอ่อน
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

