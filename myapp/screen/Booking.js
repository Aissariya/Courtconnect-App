import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

export default function Booking({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Booking Screen</Text>
      </View>

      {/* รูปภาพตรงกลางที่ขอบชิดทั้งสองข้าง */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/football.jpg')} // ใส่ path รูปที่ต้องการ
          style={styles.image}
        />
        <Text style={styles.imageText}>สนามบาสหนองงูเห่า</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#A2F193',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10, // ให้ขอบชิด
  },
  image: {
    width: '100%', // ให้ขอบชิดทั้งสองข้าง
    height: 200,
    borderRadius: 10, // ใส่ขอบมน (สามารถปรับหรือเอาออกได้)
  },
  imageText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
