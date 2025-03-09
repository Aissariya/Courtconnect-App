import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
// นำเข้า Firebase อย่างถูกต้อง
import { getFirestore, collection, doc, getDoc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApp } from 'firebase/app';

export default function Deposit() {
  const [amount, setAmount] = useState("0");
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ใช้ Firebase SDK v9 syntax
  const auth = getAuth();
  const firestore = getFirestore();

  // Fetch current user balance on component mount
  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'Wallet', userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setCurrentBalance(userDocSnap.data().balance || 0);
        } else {
          // Create wallet document if it doesn't exist
          await updateDoc(userDocRef, {
            balance: 0,
            lastUpdated: Timestamp.now()
          });
          setCurrentBalance(0);
        }
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      Alert.alert("Error", "Failed to fetch your current balance");
    }
  };

  const handleAmountChange = (text) => {
    // Remove non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Check if it's a valid number
    if (!cleanedText || isNaN(parseFloat(cleanedText))) {
      setAmount("0");
    } else {
      // Limit to 2 decimal places
      const numericValue = parseFloat(cleanedText);
      setAmount(numericValue.toString());
    }
  };

  const getFormattedAmount = () => {
    const numericValue = parseFloat(amount);
    return isNaN(numericValue) ? "0.00" : numericValue.toFixed(2);
  };

  const handleDeposit = async () => {
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const depositAmount = parseFloat(amount) || 0;
        
        if (depositAmount <= 0) {
          Alert.alert("Error", "Please enter a valid amount greater than 0");
          setIsLoading(false);
          return;
        }

        // 1. Add transaction record to Wallet collection
        const transactionRef = collection(firestore, 'Wallet');
        await addDoc(transactionRef, {
          userId: userId,
          amount: depositAmount,
          status: 'transfer_in',
          timestamp: Timestamp.now(),
          type: 'deposit'
        });

        // 2. Update user balance
        const userWalletRef = doc(firestore, 'Wallet', userId);
        const userDocSnap = await getDoc(userWalletRef);
        
        let newBalance = depositAmount;
        if (userDocSnap.exists()) {
          const currentBalanceFromDB = userDocSnap.data().balance || 0;
          newBalance = currentBalanceFromDB + depositAmount;
          
          await updateDoc(userWalletRef, {
            balance: newBalance,
            lastUpdated: Timestamp.now()
          });
        } else {
          // If user wallet document doesn't exist, create it
          await updateDoc(userWalletRef, {
            balance: depositAmount,
            lastUpdated: Timestamp.now()
          });
        }

        // 3. Update local state
        setCurrentBalance(newBalance);
        
        // 4. Close modal and reset amount
        setShowQRModal(false);
        setAmount("0");
        
        // 5. Show success message
        Alert.alert(
          "Deposit Successful",
          `฿${depositAmount.toFixed(2)} has been added to your wallet. New balance: ฿${newBalance.toFixed(2)}`
        );
      } else {
        Alert.alert("Error", "You must be logged in to make a deposit");
      }
    } catch (error) {
      console.error("Error processing deposit:", error);
      Alert.alert("Error", "Failed to process your deposit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Current Balance Display */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>฿ {currentBalance.toFixed(2)}</Text>
      </View>

      {/* Deposit Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Specify the amount :</Text>
        <View style={styles.amountBox}>
          <Text style={styles.currency}>฿</Text>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
          />
        </View>

        <Text style={styles.paymentLabel}>Payment method</Text>
        <View style={styles.paymentMethod}>
          <FontAwesome5 name="qrcode" size={20} color="black" />
          <Text style={styles.paymentText}>QR code</Text>
        </View>

        <View style={styles.paymentAmount}>
          <Text>Payment amount</Text>
          <Text style={styles.paymentAmountText}>฿ {getFormattedAmount()}</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[styles.confirmButton, isLoading && styles.disabledButton]}
        onPress={() => setShowQRModal(true)}
        disabled={isLoading}
      >
        <Text style={styles.confirmText}>
          {isLoading ? "PROCESSING..." : "CONFIRM"}
        </Text>
      </TouchableOpacity>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan QR Code to Pay</Text>
            <Text style={styles.modalAmount}>Amount: ฿{(parseFloat(amount) || 0).toFixed(2)}</Text>
            <Image
              source={require('../assets/Qrcode.jpg')}
              style={styles.qrImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleDeposit}
              disabled={isLoading}
            >
              <Text style={styles.closeButtonText}>
                {isLoading ? "PROCESSING..." : "OK"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    paddingTop: 20,
  },
  balanceContainer: {
    backgroundColor: "#4A90E2",
    width: "90%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  balanceLabel: {
    color: "white",
    fontSize: 16,
  },
  balanceAmount: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "black",
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  currency: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
    flex: 1,
    color: "#888",
  },
  paymentLabel: {
    fontSize: 14,
    color: "black",
    marginTop: 15,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 10,
  },
  paymentAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  paymentAmountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#A2F193",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
    width: "90%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalAmount: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  qrImage: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#A2F193',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  }
});