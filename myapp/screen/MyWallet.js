import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

const { width } = Dimensions.get("window");

const MyWallet = () => {
  const navigation = useNavigation();
  const [depositPressed, setDepositPressed] = useState(false);
  const [transferPressed, setTransferPressed] = useState(false);
  const [walletAmount, setWalletAmount] = useState("0.00");
  const [refreshing, setRefreshing] = useState(false);

  const auth = getAuth();
  const userAuth = auth.currentUser;

  const fetchWalletAmount = async () => {
    if (!userAuth) {
      console.error("No user is logged in");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", userAuth.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setWalletAmount(userData.wallet ? userData.wallet.toFixed(2) : "0.00");
      } else {
        console.error("User data not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  };

  useEffect(() => {
    fetchWalletAmount();
  }, [userAuth]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWalletAmount().then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* Account Information Card */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <Image source={require("../assets/logo.png")} style={styles.bankIcon} />
            <View style={styles.textContainer}>
              <Text style={styles.accountName}>Court Connect Wallet</Text>
            </View>
          </View>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceText}>{walletAmount} THB</Text>
        </View>

        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => setDepositPressed(true)}
            onPressOut={() => setDepositPressed(false)}
            onPress={() => navigation.navigate("Deposit")} // Navigate to Deposit.js
          >
            <FontAwesome5 name="university" size={24} color={depositPressed ? "#1E7D32" : "black"} />
            <Text style={[styles.buttonText, depositPressed && { color: "#1E7D32" }]}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPressIn={() => setTransferPressed(true)}
            onPressOut={() => setTransferPressed(false)}
            onPress={() => navigation.navigate("Transfer")}
          >
            <FontAwesome5 name="exchange-alt" size={24} color={transferPressed ? "#1E7D32" : "black"} />
            <Text style={[styles.buttonText, transferPressed && { color: "#1E7D32" }]}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
