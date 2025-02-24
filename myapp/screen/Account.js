import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Account({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account</Text>
      </View> */}

      {/* Sections */}
      <View style={styles.sectionContainer}>
        <Section title="My Account">
          <Card
            title="Account"
            icon="document-text-outline"
            onPress={() => navigation.navigate("MyAccount")} // Navigate to MyAccount
            options={{
              headerStyle: { backgroundColor: '#A2F193' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
              headerTitle: () => <SearchBar2 />,
              headerLeft: null,
            }}
          />
        </Section>

        <Section title="My Booking">
          <Card
            title="My Booking"
            icon="checkmark-circle-outline"
            onPress={() => navigation.navigate("MyBook")} // Navigate to MyBook
          />
          <Card
            title="Booking History"
            icon="clipboard-outline"
            onPress={() => navigation.navigate("BookingHistory")} // Navigate to MyBook
          />
        </Section>

        <Section title="My Wallet">
          <Card
            title="My Wallet"
            icon="wallet-outline"
            subText="0.00 Bath"
          />
        </Section>
      </View>
    </View>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.cardContainer}>{children}</View>
  </View>
);

const Card = ({ title, icon, subText, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={32} color="black" />
    <View>
      {/* Display title */}
      <Text style={styles.cardText}>{title ? title : "No title available"}</Text>
      {/* Display subText if available */}
      {subText && <Text style={styles.subText}>{subText}</Text>}
    </View>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A2F193",
    height: 60,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
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
  cardText: {
    fontSize: 16,
    marginLeft: 10,
  },
  subText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
});
