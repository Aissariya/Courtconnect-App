import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Database from '../Model/database';

export default function Detail({ route, navigation }) {
  const courts = Database();

  const { court_id } = route.params || {};
  console.log('court_id:', court_id);

  const item = courts.find(item => item.court_id === court_id);
  if (!item) {
    return (
      <View style={styles.loadcontainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  console.log('item:', item);

  const titlename = item ? item.field : "test";
  const mainImage = item ? { uri: item.image[0] } : require('../assets/pingpong.jpg');
  const subImages = item ? item.image.slice(1) : [];
  const price = item ? item.priceslot : "500";
  const court = item ? item.court_type : "Null";

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsContainer}>
        <Image source={mainImage} style={styles.mainImage} resizeMode="cover" />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.smallImagesContainer}>
            {subImages.map((imageUri, index) => (
              <TouchableOpacity key={index}>
                <Image source={{ uri: imageUri }} style={styles.smallImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Text style={styles.detailsTitle}>{titlename} ★★★★★ (5.0)</Text>
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>Price {price} per hour</Text>
        </View>
        <Text style={styles.detailsText}>
          Field type: {court}{"\n"}
          Facilities: locker room, shower room{"\n"}
          Business hours: Open every day 8:00 - 14:00{"\n"}
          Terms and conditions:{"\n"}
          - Users must follow the rules and regulations of the field.{"\n"}
          - If you want to cancel your reservation, you should notify in advance according to the specified period.{"\n"}
          - Use of the field must be careful to ensure the safety of all players.{"\n"}
          Payment: Can pay through various channels
        </Text>
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
      </ScrollView>
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
          onPress={() => navigation.navigate('BookingScreen', { court: item })}
          activeOpacity={1}
        >
          <View style={styles.bookingView}>
            <MaterialCommunityIcons name='cart' size={20} color='#fff' />
            <Text style={styles.bookingText}>Booking</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  loadcontainer: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainImage: {
    width: '100%',
    height: 250,  // ความสูงของรูป
    marginTop: 0,
    marginLeft: 0, // ขอบซ้ายชิดขอบจอ
    marginRight: 0, // ขอบขวาชิดขอบจอ
  },
  smallImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    width: '100%',
    // paddingHorizontal: 10,
  },
  smallImage: {
    width: 50,
    height: 50,
    margin: 5,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,  // เพิ่มช่องว่างเล็กน้อยหลังจาก ScrollView เริ่มต้น
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
    alignSelf: 'flex-start', // ชิดซ้าย
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
    width: '100%', // ชิดขอบจอทั้งสองฝั่ง
    paddingVertical: 10,
    alignItems: 'flex-start', // ชิดซ้าย
    justifyContent: 'space-between',
    marginTop: 20, // เพิ่มช่องว่างระหว่างข้อความกับแถบสีดำ
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10, // เพิ่มช่องว่างซ้ายให้ชิดซ้าย
  },
  scoreText2: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingRight: 10, // เพิ่มช่องว่างซ้ายให้ชิดขวา
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
    color: '#FFD700', // สีดาวเป็นทอง
    fontSize: 18,
    marginRight: 3,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 2, // ทำให้ปุ่มอยู่เหนือเนื้อหาที่เลื่อน
  },
  calanderButton: {
    flex: 1, // ปุ่มกินพื้นที่ครึ่งหนึ่งของจอ
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
    flex: 2, // ปุ่มกินพื้นที่ครึ่งหนึ่งของจอ
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 10,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  bookingView: {
    flexDirection: 'row',
    padding: '10'
  },
  bookingText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
