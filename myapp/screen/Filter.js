import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Filter() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [maxPrice, setMaxPrice] = useState("");
  
  const sports = [
    { name: "football", icon: "football-outline" },
    { name: "basketball", icon: "basketball-outline" },
    { name: "badminton", icon: "tennisball-outline" },
    { name: "ping pong", icon: "table-tennis" },
    { name: "tennis", icon: "tennisball-outline" },
    { name: "swim", icon: "water-outline" },
    { name: "boxing", icon: "fitness-outline" },
    { name: "aerobics", icon: "walk-outline" },
    { name: "yoga", icon: "body-outline" },
  ];

  const toggleSport = (sport) => {
    setSelectedSport(selectedSport === sport ? null : sport);
  };

  return (
    <View style={styles.container}>
      {/* Select Date and Time */}
      <Text style={styles.label}>Select date and time</Text>
      <TouchableOpacity style={styles.inputBox}>
        <Ionicons name="calendar-outline" size={20} color="white" style={styles.icon} />
        <Text style={styles.inputText}>Tuesday 24 Dec. 2024</Text>
      </TouchableOpacity>
      
      {/* Time Selection */}
      <View style={styles.timeContainer}>
        <TextInput style={styles.longInputBox} value="13:00" />
        <Text style={styles.toText}>to</Text>
        <TextInput style={styles.longInputBox} value="16:00" />
      </View>
      
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
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>
    </View>
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
      width: "48%",  // ทำให้ช่องกรอกเวลาแต่ละช่องมีความกว้าง 48%
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
  