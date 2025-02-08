import React from "react";
import { View, Text, TextInput, Image, FlatList, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import AppStack from "../navigation/AppStack";

const timeSlots = [
  "08:00 a.m.",
  "09:00 a.m.",
  "10:00 a.m.",
  "11:00 a.m.",
  "12:00 p.m.",
  "13:00 p.m.",
  "14:00 p.m.",
];

const BookingSection = () => {
  return (
    <FlatList
      data={timeSlots}
      keyExtractor={(item) => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          {/* Field Booking Schedule */}
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleText}>Field Booking Schedule</Text>
          </View>

          {/* Field Info */}
          <View style={styles.fieldInfo}>
          <Image source={require("../assets/basketball.jpg")} style={styles.fieldImage} />
            <View style={styles.fieldDetails}>
              <Text style={styles.fieldName}>สนามบาสหนองงูเห่า</Text>
              <Text style={styles.fieldText}>Player : 6-15 people/court</Text>
              <Text style={styles.fieldText}>Time : 8:00 - 14:00</Text>
              <Text style={styles.fieldText}>Price : 1 Hour/ 100 Bath</Text>
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Time</Text>
            <View style={styles.dateInputContainer}>
              <AntDesign name="calendar" size={18} color="black" style={styles.calendarIcon} />
              <TextInput style={styles.dateInput} placeholder="Select date" />
            </View>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.timeSlot}>
          <Text style={styles.timeText}>{item}</Text>
          <View style={styles.bookButton}></View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  scheduleContainer: {
    backgroundColor: "#A2F193",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fieldInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  fieldImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  fieldDetails: {
    flex: 1,
  },
  fieldName: {
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "black",
    color: "white",
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  fieldText: {
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A2F193",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  timeLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#A2F193",
    flex: 1,
  },
  calendarIcon: {
    marginRight: 5,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 5,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  timeText: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
    width: 80,
    textAlign: "center",
  },
  bookButton: {
    flex: 1,
    height: 40,
    borderColor: "#A2F193",
    borderWidth: 2,
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
});

export default BookingSection;
