import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Account({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Section title="My Account">
          <Card title="Account" icon="document-text-outline" onPress={() => navigation.navigate("MyAccount")} />
        </Section>

        <Section title="My Booking">
          <Card title="My Booking" icon="checkmark-circle-outline" onPress={() => navigation.navigate("MyBook")} />
          <Card title="Booking History" icon="clipboard-outline" onPress={() => navigation.navigate("BookingHistory")} />
        </Section>

        <Section title="My Wallet">
          <Card title="My Wallet" icon="wallet-outline" subText="0.00 THB" onPress={() => navigation.navigate("MyWallet")} />
        </Section>
      </View>

      {/* Logout Button */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.cardContainer}>{children}</View>
  </View>
);

const Card = ({ title, icon, subText, onPress }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, pressed && styles.cardPressed]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => {
        setTimeout(() => setPressed(false), 100);
        onPress();
      }}
    >
      <Ionicons name={icon} size={32} color="black" />
      <View>
        <Text style={styles.cardText}>{title}</Text>
        {subText && <Text style={styles.subText}>{subText}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  cardPressed: {
    backgroundColor: "#DFFFD6",
  },
  cardText: {
    fontSize: 16,
    marginLeft: 10,
    color:"black"
  },
  subText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "white",
    paddingVertical: 12,
    alignItems: "center",
    margin: 16,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
