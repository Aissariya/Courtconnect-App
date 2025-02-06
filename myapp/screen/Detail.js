import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Detail({ navigation }) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/basketball.jpg')} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      {/* รูปภาพเล็กๆ 6 รูป */}
      <View style={styles.smallImagesContainer}>
        <Image 
          source={require('../assets/basketball.jpg')} 
          style={styles.smallImage}
        />
        <Image 
          source={require('../assets/basketball.jpg')} 
          style={styles.smallImage}
        />
        <Image 
          source={require('../assets/basketball.jpg')} 
          style={styles.smallImage}
        />
        <Image 
          source={require('../assets/basketball.jpg')} 
          style={styles.smallImage}
        />
        <Image 
          source={require('../assets/basketball.jpg')} 
          style={styles.smallImage}
        />
        <Image 
          source={require('../assets/basketball.jpg')} 
          style={styles.smallImage}
        />
      </View>
      
      {/* ข้อความ สนามบาสหนองงูเห่า */}
      <Text style={styles.detailsLeft}>สนามบาสหนองงูเห่า</Text>
      
      {/* กล่องข้อความ Price 500 per Hour */}
      <View style={styles.priceBox}>
        <Text style={styles.priceText}>Price 500 per Hour</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.calanderButton} 
          onPress={() => navigation.navigate('CalanderScreen')}
        >
          <Text style={styles.calanderText}>Calander</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bookingButton} 
          onPress={() => navigation.navigate('BookingScreen')}
        >
          <Text style={styles.bookingText}>Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 0,
  },
  image: {
    width: '100%',
    height: 220,
    marginTop: 0,
  },
  smallImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  smallImage: {
    width: 50,
    height: 50,
    margin: 5,
  },
  detailsLeft: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 10,
  },
  priceBox: {
    marginTop: 10,  // ลดระยะห่างกับข้อความ "สนามบาสหนองงูเห่า"
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',   // ทำให้กล่องกว้างกว่าเดิม
    marginLeft: -140,  // ชิดขอบซ้าย
  },
  priceText: {
    color: '#A2F193',   // สีเขียวอ่อน
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,  // ทำให้ปุ่มชิดขอบซ้าย
    right: 0,  // เพิ่มระยะห่างจากขอบขวา
    flexDirection: 'row',
    justifyContent: 'flex-end', // ทำให้ปุ่มขยับไปชิดกัน
    paddingHorizontal: 0,
  },
  bookingButton: {
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: 'black',
    width: '50%',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  bookingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calanderButton: {
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  calanderText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
