import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const MyWallet = () => {
  return (
    <View style={styles.container}>
      {/* Account Info Card */}
      <View style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <Image source={require("../assets/logo.png")} style={styles.bankIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.accountName}>Court Connect Wallet</Text>
            
          </View>
        </View>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceText}>0.00</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <FontAwesome5 name="dollar-sign" size={24} color="black" />
          <Text style={styles.buttonText}>Top up</Text>
        </View>
        <View style={styles.button}>
          <FontAwesome5 name="credit-card" size={24} color="black" />
          <Text style={styles.buttonText}>Transfer</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    paddingTop: 20,
  },
  accountCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: width - 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "flex-start",
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  bankIcon: {
    width: 40,
    height: 40,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bankName: {
    fontSize: 12,
    color: "gray",
  },
  balanceLabel: {
    fontSize: 14,
    color: "black",
    marginTop: 10,
  },
  balanceText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
    
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 10,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: width - 40,
  },
  button: {
    alignItems: "center",
    flex: 1,
    padding: 10,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    color: "black",
  },
});

export default MyWallet;