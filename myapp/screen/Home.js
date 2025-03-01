import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { windowWidth } from '../utils/Dimensions';
import Database from '../Model/database';

export default function Home({ navigation }) {
  const courts = Database();

  const sections = [
    // { title: "All Courts", data: courts },
    { title: "Football", data: courts.filter(item => item.court_type === "Football"), court_type: "Football" },
    { title: "Basketball", data: courts.filter(item => item.court_type === "Basketball"), court_type: "Basketball" },
    { title: "Badminton", data: courts.filter(item => item.court_type === "Badminton"), court_type: "Badminton" },
    { title: "Tennis", data: courts.filter(item => item.court_type === "Tennis"), court_type: "Tennis" },
    { title: "Ping Pong", data: courts.filter(item => item.court_type === "Ping Pong"), court_type: "Ping Pong" },
    { title: "Swimming", data: courts.filter(item => item.court_type === "Swimming"), court_type: "Swimming" },
  ];

  // ฟังก์ชันสำหรับแสดงรายการ
  const renderItem = ({ item }) => {
    // console.log('court_id:', item.court_id);
    return item.image ? (
      <ImageBackground source={{ uri: item.image[0] }} style={styles.image}>
        <TouchableOpacity
          style={{ flex: 1, width: '100%' }}
          onPress={() => navigation.navigate('DetailScreen', { court_id: item.court_id })}
        />
        <View style={styles.LeftBox}>
          <View style={styles.TextBox2}>
            <Text style={styles.TitelText}>{item.field}</Text>
          </View>
          <View>
            <Text style={styles.TitelText2}>★★★★★ (5.0)</Text>
          </View>
        </View>
      </ImageBackground>
    ) : (
      <View style={styles.card}>
        <Text style={styles.text}>ที่อยู่: {item.address || "N/A"}</Text>
        <Text style={styles.text}>เวลาจอง: {item.bookingslot || 60} นาที</Text>
        <Text style={styles.text}>ความจุ: {item.capacity || "N/A"}</Text>
        <Text style={styles.text}>Court ID: {item.court_id || "c01"}</Text>
        <Text style={styles.text}>ประเภท: {item.court_type || "football"}</Text>
        <Text style={styles.text}>สนาม: {item.field || "test1"}</Text>
        <Text style={styles.text}>ราคา: {item.priceslot || 1500} บาท</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            {/* หัวข้อแต่ละหมวดหมู่ */}
            <View style={styles.headerContainer}>
              <Text style={styles.headfont}>{item.title}</Text>
              {item.court_type !== undefined && (
                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { court_type: item.court_type })}>
                  <Text style={styles.showMoreText}>ดูเพิ่มเติม</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* รายการข้อมูลที่อยู่ในแต่ละหมวด */}
            <FlatList
              data={item.data}
              keyExtractor={(subItem) => subItem.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headfont: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  showMoreText: {
    color: '#0aada8',
    marginRight: 10,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center",
  },
  LeftBox: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  TextBox: {
    margin: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  TextBox2: {
    marginBottom: 5,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  TitelText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  TitelText2: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    width: windowWidth - 20,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',

    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    margin: 10,
    width: windowWidth - 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
