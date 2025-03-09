import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; // ✅ เพิ่ม import ที่หายไป
import { db } from "../FirebaseConfig";

const { width } = Dimensions.get("window");

const MyWallet = () => {
  const navigation = useNavigation();
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
      // 1️⃣ ดึง wallet_id จาก Users collection
      const userRef = doc(db, "users", userAuth.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User document not found in Firestore");
        return;
      }

      const userData = userDoc.data();
      const walletId = userData.wallet_id || null; // ✅ ป้องกัน wallet_id เป็น undefined

      console.log("User wallet_id:", walletId); // Debugging

      if (!walletId) {
        console.error("wallet_id not found for user");
        return;
      }

      // 2️⃣ ค้นหา document ที่มี field "wallet_id" ใน Wallet collection
      const walletQuery = query(collection(db, "Wallet"), where("wallet_id", "==", walletId));
      const walletSnapshot = await getDocs(walletQuery);

      if (walletSnapshot.empty) {
        console.error(`No wallet found with wallet_id: ${walletId}`);
        return;
      }

      // 3️⃣ ดึงข้อมูล balance
      let walletData = null;
      walletSnapshot.forEach((doc) => {
        walletData = doc.data();
      });

      if (walletData && walletData.balance !== undefined) {
        setWalletAmount(walletData.balance.toFixed(2)); // ✅ ป้องกัน null และ format ให้เป็นทศนิยม 2 ตำแหน่ง
        console.log("Wallet Balance:", walletData.balance);
      } else {
        console.error("Balance not found in Wallet document");
      }

    } catch (error) {
      console.error("Error fetching wallet balance:", error);
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
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
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Deposit")}>
            <FontAwesome5 name="university" size={24} color="black" />
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
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
  textContainer: { marginLeft: 10 },
  bankIcon: { width: 40, height: 40 },
  accountName: { fontSize: 16, fontWeight: "bold" },
  balanceLabel: { fontSize: 14, color: "black", marginTop: 10 },
  balanceText: { fontSize: 25, fontWeight: "bold", color: "black", marginTop: 10 },
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
  button: { alignItems: "center", flex: 1, padding: 10 },
  buttonText: { marginTop: 5, fontSize: 14, color: "black" },
});

export default MyWallet;