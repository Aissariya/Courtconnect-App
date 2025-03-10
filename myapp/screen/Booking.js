import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Modal, Button, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { collection, addDoc, getFirestore, doc, getDoc, updateDoc, arrayUnion, getDocs, query, where, serverTimestamp,Timestamp } from 'firebase/firestore';
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
  const [userData, setUserData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);


  // เพิ่ม useEffect เพื่อดึงข้อมูล user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
            console.log("Fetched user data:", userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User's wallet_id:", userData.wallet_id);
  
            if (userData.wallet_id) {
              const q = query(collection(db, "Wallet"), where("wallet_id", "==", userData.wallet_id));
              const walletSnapshot = await getDocs(q);
  
              if (!walletSnapshot.empty) {
                // ดึงเอกสารแรกที่ตรงกัน
                const walletData = walletSnapshot.docs[0].data();
                setWalletBalance(walletData.balance);
                console.log("Fetched Wallet Data:", walletData);
              } else {
                console.error("❌ Wallet not found in Wallet collection!");
              }
            } else {
              console.error("❌ User does not have a wallet_id!");
            }
          }
        }
      } catch (error) {
        console.error("❌ Error fetching wallet balance:", error);
      }
    };
  
    fetchWalletBalance();
  }, []);

  const formatTo12Hour = (date24) => {
    console.log('Converting date:', date24);
    const date = new Date(date24);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true // บังคับให้แสดงเวลาในรูปแบบ 12 ชั่วโมง
    });
  };

  const formatTimeTo12Hour = (date) => {
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const roundToHour = (date) => {
    const roundedDate = new Date(date);
    roundedDate.setMinutes(0);
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    return roundedDate;
  };

  const compareDates = (selectedStartDate, selectedEndDate, bookingStart, bookingEnd) => {
    // แปลงเวลาให้เป็นชั่วโมงกลมๆ
    const roundedSelectedStart = roundToHour(selectedStartDate);
    const roundedSelectedEnd = roundToHour(selectedEndDate);
    const roundedBookingStart = roundToHour(bookingStart);
    const roundedBookingEnd = roundToHour(bookingEnd);

    console.log('Comparing rounded times:', {
      selectedStart: roundedSelectedStart.toLocaleString(),
      selectedEnd: roundedSelectedEnd.toLocaleString(),
      bookingStart: roundedBookingStart.toLocaleString(),
      bookingEnd: roundedBookingEnd.toLocaleString()
    });

    // ตรวจสอบการซ้อนทับของช่วงเวลา
    return (
      (roundedSelectedStart.getTime() >= roundedBookingStart.getTime() && 
       roundedSelectedStart.getTime() < roundedBookingEnd.getTime()) || 
      (roundedSelectedEnd.getTime() > roundedBookingStart.getTime() && 
       roundedSelectedEnd.getTime() <= roundedBookingEnd.getTime()) ||
      (roundedSelectedStart.getTime() <= roundedBookingStart.getTime() && 
       roundedSelectedEnd.getTime() >= roundedBookingEnd.getTime())
    );
  };

  // เพิ่มฟังก์ชันตรวจสอบการจองซ้ำ
  const checkBookingConflict = async () => {
    console.log('=== Starting Booking Conflict Check ===');
    console.log('Checking for:', {
      court_id: court?.court_id,
      selected_date: date,
      start_time: `${hourStart}:${minuteStart}`,
      end_time: `${hourEnd}:${minuteEnd}`
    });

    if (!court?.court_id || !date) {
      console.log('Missing required data for checking');
      return false;
    }

    try {
      // สร้างวันที่และเวลาที่เลือก
      const selectedStartDate = new Date(date);
      selectedStartDate.setHours(parseInt(hourStart), parseInt(minuteStart));
      
      const selectedEndDate = new Date(date);
      selectedEndDate.setHours(parseInt(hourEnd), parseInt(minuteEnd));

      console.log('Selected time range:', {
        start: formatTo12Hour(selectedStartDate),
        end: formatTo12Hour(selectedEndDate)
      });

      // ดึงข้อมูลการจองทั้งหมดของสนามนี้
      const bookingRef = collection(db, 'Booking');
      const bookingsSnapshot = await getDocs(
        query(bookingRef, where('court_id', '==', court.court_id))
      );

      console.log(`Found ${bookingsSnapshot.size} existing bookings for this court`);

      // ตรวจสอบการจองที่ซ้ำซ้อน
      for (const doc of bookingsSnapshot.docs) {
        const booking = doc.data();
        
        // แปลงสตริงวันที่เวลาเป็น Date object
        const parseBookingTime = (timeStr) => {
          try {
            // แยกวันที่และเวลา
            const [monthDay, yearTime] = timeStr.split(', ');
            const [year, timeStr2] = yearTime.split(' at ');
            const [time, period] = timeStr2.split(' UTC')[0].split(' ');
            const [month, day] = monthDay.split(' ');
            
            // แปลงชื่อเดือนเป็นตัวเลข
            const months = {
              January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
              July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
            };
            
            // แยกชั่วโมงและนาที
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            
            // แปลงเป็น 24 ชั่วโมง
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            
            return new Date(parseInt(year), months[month], parseInt(day), hour, parseInt(minutes));
          } catch (error) {
            console.error('Error parsing time:', error, timeStr);
            return null;
          }
        };

        const bookingStart = parseBookingTime(booking.start_time);
        const bookingEnd = parseBookingTime(booking.end_time);

        if (!bookingStart || !bookingEnd) continue;

        console.log('Comparing bookings:', {
          selected: {
            start: formatTimeTo12Hour(selectedStartDate),
            end: formatTimeTo12Hour(selectedEndDate)
          },
          existing: {
            start: formatTimeTo12Hour(bookingStart),
            end: formatTimeTo12Hour(bookingEnd)
          }
        });

        if (compareDates(selectedStartDate, selectedEndDate, bookingStart, bookingEnd)) {
          console.log('⚠️ Booking conflict found!');
          return {
            hasConflict: true,
            conflictTime: `${formatTimeTo12Hour(bookingStart)} - ${formatTimeTo12Hour(bookingEnd)}`
          };
        }
      }

      console.log('✅ No booking conflicts found');
      return { hasConflict: false };

    } catch (error) {
      console.error('Error checking booking conflicts:', error);
      return { hasConflict: false };
    }
  };

  // แก้ไขฟังก์ชัน handleConfirm
  const handleConfirm = async () => {
    console.log('=== Starting Booking Process ===');
    
    if (!validateBooking()) {
      console.log('❌ Booking validation failed');
      return;
    }

    try {
      console.log('Checking for booking conflicts...');
      const { hasConflict, conflictTime } = await checkBookingConflict();
      
      if (hasConflict) {
        console.log('❌ Booking conflict detected');
        alert(`This time slot is already booked!\nBooked time: ${conflictTime}\n\nPlease select a different time.`);
        return;
      }

      console.log('✅ No conflicts found, proceeding with booking');
      setShowConfirmModal(true);
      
    } catch (error) {
      console.error('Error in handleConfirm:', error);
      alert('An error occurred while checking the booking availability.');
    }
  };

  const convertTo12Hour = (hour24, minute) => {
    console.log('Converting time:', { hour24, minute });
    const hour = parseInt(hour24);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    console.log('Converted to:', {
      hour12,
      period,
      formatted: `${String(hour12).padStart(2, '0')}:${minute} ${period}`
    });
    
    return `${String(hour12).padStart(2, '0')}:${minute} ${period}`;
  };

  const formatTimeForDB = (date, hour24, minute) => {
    // Format date part
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Convert time to 12-hour format with AM/PM
    const formattedTime = convertTo12Hour(hour24, minute);

    const result = `${formattedDate} at ${formattedTime} UTC+7`;
    console.log('Formatted datetime for DB:', result);
    return result;
  };

  const handleFinalConfirm = async () => {
    try {
      setIsLoading(true);
      console.log('=== Starting Payment Process ===');

      // 1. ดึงข้อมูล user wallet ที่จะจ่ายเงิน
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser || !userData) {
        throw new Error('No user data available');
      }

      // 2. ดึงข้อมูลจาก Court collection เพื่อหา user_id ของเจ้าของสนาม
      const courtsRef = collection(db, 'Court');
      const courtQuery = query(courtsRef, where('court_id', '==', court.court_id));
      const courtSnapshot = await getDocs(courtQuery);

      if (courtSnapshot.empty) {
        throw new Error('Court not found');
      }

      const courtData = courtSnapshot.docs[0].data();
      const courtOwnerId = courtData.user_id;
      console.log('Court owner ID:', courtOwnerId);

      // 3. ดึง wallet_id ของเจ้าของสนามจาก users collection
      const usersRef = collection(db, 'users');
      const courtOwnerQuery = query(usersRef, where('user_id', '==', courtOwnerId));
      const userSnapshot = await getDocs(courtOwnerQuery);

      if (userSnapshot.empty) {
        throw new Error('Court owner not found');
      }

      const courtOwnerData = userSnapshot.docs[0].data();
      const courtOwnerWalletId = courtOwnerData.wallet_id;
      console.log('Court owner wallet ID:', courtOwnerWalletId);

      // 4. ดึงข้อมูล wallet ของทั้งสองฝ่าย
      const walletsRef = collection(db, 'Wallet');
      const [payerWalletSnapshot, receiverWalletSnapshot] = await Promise.all([
        getDocs(query(walletsRef, where('wallet_id', '==', userData.wallet_id))),
        getDocs(query(walletsRef, where('wallet_id', '==', courtOwnerWalletId)))
      ]);

      if (payerWalletSnapshot.empty || receiverWalletSnapshot.empty) {
        throw new Error('Wallet information not found');
      }

      const payerWalletDoc = payerWalletSnapshot.docs[0];
      const receiverWalletDoc = receiverWalletSnapshot.docs[0];
      const payerBalance = payerWalletDoc.data().balance;
      const receiverBalance = receiverWalletDoc.data().balance;

      // 5. ตรวจสอบยอดเงินและทำการโอน
      if (payerBalance < totalPrice) {
        throw new Error('Insufficient balance');
      }

      // 6. อัพเดตยอดเงินทั้งสองฝ่าย
      await Promise.all([
        updateDoc(payerWalletDoc.ref, {
          balance: payerBalance - totalPrice,
          amount: totalPrice,
          status: "tranfer_out",
          create_at: Timestamp.now(),
        }),
        updateDoc(receiverWalletDoc.ref, {
          balance: receiverBalance + totalPrice,
          amount: totalPrice,
          status: "tranfer_in",
          create_at: Timestamp.now(),
        })
      ]);

      console.log('Payment completed successfully');
      console.log('New payer balance:', payerBalance - totalPrice);
      console.log('New receiver balance:', receiverBalance + totalPrice);

      // 7. บันทึกการจอง
      const booking_id = `BK${Date.now()}`;
      const bookingRef = collection(db, 'Booking');
      await addDoc(bookingRef, {
        booking_id,
        court_id: court.court_id,
        end_time: formatTimeForDB(date, hourEnd, minuteEnd),
        start_time: formatTimeForDB(date, hourStart, minuteStart),
        status: "successful",
        user_id: userData.user_id,
        timestamp: serverTimestamp()
      });

      // อัพเดต UI
      setWalletBalance(payerBalance - totalPrice);
      setShowConfirmModal(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigation.navigate('MainTab');
      }, 2000);

    } catch (error) {
      console.error('Error in payment process:', error);
      alert('Failed to process payment: ' + error.message);
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
    const hours = Math.floor(diffMinutes / 60); // จำนวนชั่วโมงเต็ม
    const remainingMinutes = diffMinutes % 60; // จำนวนนาทีที่เหลือ
    
    // คำนวณจำนวนชั่วโมงที่จะคิดเงิน
    let billableHours = hours;
    if (remainingMinutes > 30) {
      // ถ้าเกิน 30 นาที ปัดขึ้นเป็นชั่วโมงถัดไป
      billableHours += 1;
    } else if (remainingMinutes > 0) {
      // ถ้าไม่เกิน 30 นาที คิดราคาตามจริง
      billableHours += remainingMinutes / 60;
    }
    
    // ใช้ราคาจาก court.priceslot
    const pricePerHour = court?.priceslot || 500; // ใช้ 500 เป็นค่าเริ่มต้นถ้าไม่มี priceslot
    const price = Math.round(billableHours * pricePerHour); // ปัดเศษให้เป็นจำนวนเต็ม
    
    setTotalPrice(price);
    return price;
  };

  // ฟังก์ชัน validateBooking
  const validateBooking = () => {
    if (!date) {
      alert('Please select a date');
      return false;
    }

    const now = new Date();
    const selectedDate = new Date(date);
    const selectedTime = new Date(date);
    selectedTime.setHours(parseInt(hourStart), parseInt(minuteStart), 0, 0);

    // เช็คว่าเป็นวันในอดีตหรือไม่
    if (selectedDate.setHours(0,0,0,0) < now.setHours(0,0,0,0)) {
      alert('Cannot select past dates. Please select a future date.');
      return false;
    }

    // เช็คว่าเป็นเวลาในอดีตหรือไม่ (สำหรับวันนี้)
    if (selectedDate.setHours(0,0,0,0) === now.setHours(0,0,0,0)) {
      if (selectedTime < new Date()) {
        alert('Cannot select past time. Please select a future time.');
        return false;
      }
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
                <Text style={styles.walletBalance}>{walletBalance.toFixed(2)} Bath</Text>
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

