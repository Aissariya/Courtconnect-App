import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Image, TextInput, ScrollView } from 'react-native';

const App = () => {
  const [hourStart, setHourStart] = useState("12");
  const [minuteStart, setMinuteStart] = useState("00");
  const [hourEnd, setHourEnd] = useState("14");
  const [minuteEnd, setMinuteEnd] = useState("00");
  const [showStartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setShowEndTimeModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

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
          <TextInput style={styles.input} placeholder="Date *" />

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

      {/* ปุ่มยืนยันการจอง */}
      <View style={styles.footer}>
        <View style={styles.priceBox}>
          <Text style={styles.footerPrice}>{totalPrice} Bath</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
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
    color: 'black',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ให้ Wallet และ QR Code อยู่กันคนละฝั่ง
  },
  paymentIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  walletBalance: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceBox: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '50%',
  },
  footerPrice: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#A2F193',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '50%',
  },
  confirmText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});

export default App;
