import React from 'react';
import { View, Image } from 'react-native';

export default function BannerSlider({ data }) {
  if (!data || !data.image) {
    return <Text> data</Text>; // กรณีข้อมูลไม่ถูกต้อง
  }
  try {
    // ส่วนของโค้ดที่อาจเกิดข้อผิดพลาด
    console.log(sliderData);  // ตรวจสอบค่าของ sliderData
  } catch (error) {
    console.error(error);  // จับข้อผิดพลาด
  }
  return (
    <View>
      <Image source={data.image} style={{ height: 150, width: 300 }} />
    </View>
  );
  
}