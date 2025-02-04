import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


export default function Home2({ navigation }) {
  return (
      <View style={styles.content}>
        <Text>Welcome to Home2 Screen</Text>
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
