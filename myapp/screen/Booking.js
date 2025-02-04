import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


export default function Booking({ navigation }) {
  return (
      <View style={styles.content}>
        <Text>Welcome to Booking Screen</Text>
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
