import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


export default function BookingHistory({ navigation }) {
  return (
      <View style={styles.content}>
        <Text>Welcome to Booking History Screen</Text>
      </View>

  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
  },
});
