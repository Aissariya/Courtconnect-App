import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function Booking() {
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
          <TextInput style={styles.input} placeholder="Time *" />

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total (1 hrs.)</Text>
            <Text style={styles.priceText}>500 BATH</Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.paymentMethod}>
            {/* QR Code */}
            <Image source={require('../assets/Qrcode.jpg')} style={styles.paymentIcon} />
            
            {/* My Wallet (รวมไอคอน) */}
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
          <Text style={styles.footerPrice}>500 Bath</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🎨 สไตล์ของหน้า Booking
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
    backgroundColor: 'black', // เปลี่ยนพื้นหลังเป็นสีดำ
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '50%', // ทำให้กล่องราคาครึ่งหนึ่งของหน้าจอ
  },
  footerPrice: {
    color: 'white', // เปลี่ยนตัวอักษรให้เป็นสีขาว
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#A2F193',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '50%', // ทำให้ปุ่มครึ่งหนึ่งของหน้าจอ
  },
  confirmText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
});
