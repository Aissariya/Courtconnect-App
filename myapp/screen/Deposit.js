
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Deposit() {
  const [amount, setAmount] = useState("0");
  const [showQRModal, setShowQRModal] = useState(false);

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

  return (
    <View style={styles.container}>
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
        style={styles.confirmButton}
        onPress={() => setShowQRModal(true)}
      >
        <Text style={styles.confirmText}>CONFIRM</Text>
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
              onPress={() => setShowQRModal(false)}
            >
              <Text style={styles.closeButtonText}>OK</Text>
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
