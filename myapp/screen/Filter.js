import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Filter({ navigation }) {
  const [selectedSport, setSelectedSport] = useState(null);
  const [maxPrice, setMaxPrice] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().setMinutes(0, 0, 0));
  const [endTime, setEndTime] = useState(new Date().setMinutes(0, 0, 0));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const sports = [
    { name: "Football", icon: "football-outline" },
    { name: "Basketball", icon: "basketball-outline" },
    { name: "Badminton", icon: "tennisball-outline" },
    { name: "Ping Pong", icon: "ellipse-outline" },
    { name: "Tennis", icon: "tennisball-outline" },
    { name: "Swimming", icon: "water-outline" },
    { name: "Boxing", icon: "fitness-outline" },
    { name: "Aerobic", icon: "walk-outline" },
    { name: "Yoga", icon: "body-outline" },
  ];

  const toggleSport = (sport) => {
    setSelectedSport(selectedSport === sport ? null : sport);
  };

  const handleSearch = () => {
    if (selectedSport) {
      if (maxPrice === "") {
        alert("Please enter a maximum price!");
      } else {
        navigation.navigate("SearchScreen", { court_type: selectedSport, priceslot: maxPrice });
      }
    } else {
      alert("Please select a sport!");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    currentTime.setMinutes(0, 0, 0); // Set minutes to 00
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    currentTime.setMinutes(0, 0, 0); // Set minutes to 00
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const showStartTimepicker = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimepicker = () => {
    setShowEndTimePicker(true);
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Select Date */}
      <Text style={styles.label}>Select date</Text>
      <TouchableOpacity style={styles.inputBox} onPress={showDatepicker}>
        <Ionicons name="calendar-outline" size={20} color="white" style={styles.icon} />
        <Text style={styles.inputText}>{formatDate(date)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Select Time */}
      <Text style={styles.label}>Select time</Text>
      <View style={styles.timeContainer}>
        <TouchableOpacity style={styles.longInputBox} onPress={showStartTimepicker}>
          <Text style={styles.inputText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>
        <Text style={styles.toText}>to</Text>
        <TouchableOpacity style={styles.longInputBox} onPress={showEndTimepicker}>
          <Text style={styles.inputText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>

      {showStartTimePicker && (
        <DateTimePicker
          testID="startTimePicker"
          value={new Date(startTime)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeStartTime}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          testID="endTimePicker"
          value={new Date(endTime)}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeEndTime}
        />
      )}

      {/* Max Price */}
      <Text style={styles.label}>Maximum price per hour (BATH)</Text>
      <TextInput
        style={styles.inputBox}
        value={maxPrice}
        onChangeText={setMaxPrice}
        keyboardType="numeric"
        placeholder="Enter price"
        placeholderTextColor="white"
      />

      {/* Sports Type */}
      <Text style={styles.label}>Sports type</Text>
      <View style={styles.sportsContainer}>
        {sports.map((sport) => (
          <TouchableOpacity
            key={sport.name}
            style={[styles.sportIcon, selectedSport === sport.name && styles.selectedSport]}
            onPress={() => toggleSport(sport.name)}
          >
            <Ionicons name={sport.icon} size={24} color={selectedSport === sport.name ? "green" : "black"} />
            <Text style={styles.sportText}>{sport.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    color: "white",
    width: "100%",
  },
  longInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    color: "white",
    width: "45%",  // ทำให้ช่องกรอกเวลาแต่ละช่องมีความกว้าง 45%
  },
  inputText: {
    color: "white",
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // ให้มีระยะห่างระหว่างช่องกรอกเวลา
    alignItems: "center",
    width: "100%", // ใช้พื้นที่เต็มของบรรทัด
  },
  toText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  sportIcon: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 80,
  },
  selectedSport: {
    backgroundColor: "#DFFFD6",
  },
  sportText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  searchButton: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  searchText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
