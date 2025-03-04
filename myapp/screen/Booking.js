import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // เพิ่มการใช้งาน DateTimePicker
import { AntDesign } from '@expo/vector-icons'; // ต้องการใช้ไอคอนปฏิทิน
import { useNavigation } from '@react-navigation/native';

const App = () => {
  const [hourStart, setHourStart] = useState("12");
  const [minuteStart, setMinuteStart] = useState("00");
  const [hourEnd, setHourEnd] = useState("14");
  const [minuteEnd, setMinuteEnd] = useState("00");
  const [showStartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setShowEndTimeModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation();

  const handleConfirm = () => {
    setShowConfirmModal(true);
  };
  
  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    navigation.navigate('MainTab');
  };
  
  const handleSuccessPress = () => {
    setShowSuccess(false);
    navigation.navigate('MainTab');
  };

  // ฟังก์ชันคำนวณราคา
  const calculatePrice = (hStart, mStart, hEnd, mEnd) => {
    let startMinutes = parseInt(hStart) * 60 + parseInt(mStart);
    let endMinutes = parseInt(hEnd) * 60 + parseInt(mEnd);

    if (endMinutes <= startMinutes) {
      setTotalPrice(0); // กรณีเลือกเวลาจบก่อนเวลาเริ่ม
      return;
    }

    let diffMinutes = endMinutes - startMinutes;
    let hours = Math.floor(diffMinutes / 60);
    let remainingMinutes = diffMinutes % 60;

    if (remainingMinutes > 30) {
      hours += 1; // ปัดขึ้นเป็นชั่วโมงถัดไปถ้าเกิน 30 นาที
    }

    setTotalPrice(hours * 500);
  };

  // เพิ่มสถานะสำหรับการเลือกวันที่
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* หัวข้อ Booking ตรงกลาง */}
        <Text style={styles.header}>Booking</Text>

        {/* การ์ดข้อมูลสนาม */}
        <View style={styles.card}>
          <Image source={require('../assets/basketball.jpg')} style={styles.courtImage} />
          <View style={styles.courtDetails}>
            <Text style={styles.courtTitle}>สนามบาสหนองงูเห่า</Text>
            <Text style={styles.courtSubtitle}>โรงเรียนหนองงูเห่า</Text>
          </View>
        </View>

        {/* Booking Details */}
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>159 ถนนบรรพปราการ ตำบลเวียง อำเภอเมืองเชียงราย จังหวัดเชียงราย</Text>

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
            <Image source={require('../assets/Qrcode.jpg')} style={styles.paymentIcon} />
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
        <TouchableOpacity style={styles.confirmButton} onPress={() => setShowConfirmModal(true)}>
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
            <Ionicons name="checkmark-circle" size={100} color="green" />
            <Image source={require('../assets/check.png')} style={{ width: 150, height: 150, marginTop: 20 }} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
});

export default App;