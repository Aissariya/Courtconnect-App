import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';

export default function Booking({ navigation }) {
  return (
    <View style={styles.container}>
      {/* ส่วน Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking</Text>
      </View>

      {/* รายละเอียดสนาม */}
      <View style={styles.card}>
        <Image source={require('../assets/basketball.jpg')} style={styles.courtImage} />
        <View>
          <Text style={styles.courtName}>สนามบาสหนองงูเห่า</Text>
          <Text style={styles.schoolName}>โรงเรียนหนองงูเห่า</Text>
        </View>
      </View>

      {/* รายละเอียดการจอง */}
      <Text style={styles.sectionTitle}>Booking Details</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.text}>
          159 ถนนบรรพปราการ ตำบลเวียง{'\n'}
          อำเภอเมืองเชียงราย{'\n'}
          จังหวัดเชียงราย
        </Text>
        <Text style={styles.label}>Date</Text>
        <TextInput style={styles.input} placeholder="Date *" />
        <Text style={styles.label}>Time</Text>
        <TextInput style={styles.input} placeholder="Time *" />
        <Text style={styles.total}>Total (1 hrs.) 500 BATH</Text>
      </View>

      {/* วิธีการชำระเงิน */}
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.card}>
        <View style={styles.paymentMethod}>
          <Image source={require('../assets/Qrcode.jpg')} style={styles.paymentIcon} />
          <View>
            <Text style={styles.walletText}>My Wallet</Text>
            <Text style={styles.walletBalance}>0.00 Bath</Text>
          </View>
        </View>
      </View>

      {/* ปุ่มยืนยันการจอง */}
      <View style={styles.footer}>
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>500 Bath</Text>
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
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 10,
  },
  backText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  courtImage: {
    width: 80,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  courtName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  schoolName: {
    fontSize: 14,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  text: {
    fontSize: 14,
    color: 'gray',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  walletText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  walletBalance: {
    fontSize: 14,
    color: 'gray',
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  priceBox: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 15,
    alignItems: 'center',
  },
  priceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#A2F193',
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
