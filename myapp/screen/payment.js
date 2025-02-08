import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [totalPrice, setTotalPrice] = useState(500);

  const calculatePrice = (start, end) => {
    const startHours = start.getHours();
    const startMinutes = start.getMinutes();
    const endHours = end.getHours();
    const endMinutes = end.getMinutes();
    
    let duration = endHours - startHours;
    if (endMinutes > startMinutes) {
      duration += (endMinutes - startMinutes) > 30 ? 1 : 0;
    }
    
    setTotalPrice(duration * 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.search}>🔍</Text>
        <Text style={styles.title}>Booking</Text>
        <Text style={styles.filter}>⚙️</Text>
      </View>
      
      <View style={styles.card}>
        <Image 
                  source={require('../assets/basketball.jpg')} 
                  style={styles.mainImage} 
                  resizeMode="cover"
                />
        <Text style={styles.locationTitle}>สนามบาสหนองจู๋</Text>
        <Text style={styles.locationSubtitle}>โรงเรียนหนองจู๋</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.address}>159 ถนนบรรพปราการ ตำบลเวียง อำเภอเมืองเชียงราย จังหวัดเชียงราย</Text>
        
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowStartTimePicker(true)}>
          <Text>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) {
                setStartTime(selectedTime);
                calculatePrice(selectedTime, endTime);
              }
            }}
          />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowEndTimePicker(true)}>
          <Text>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) {
                setEndTime(selectedTime);
                calculatePrice(startTime, selectedTime);
              }
            }}
          />
        )}
        
        <Text style={styles.total}>Total {totalPrice} BATH</Text>
      </View>

      <View style={styles.payment}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentBox}>
          <Text>📷 QR Code</Text>
          <Text>My Wallet 0.00 Bath</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>CONFIRM</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#A8E890',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  details: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
