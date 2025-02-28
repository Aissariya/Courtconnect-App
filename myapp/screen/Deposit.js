import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Deposit() {
  const [amount, setAmount] = useState("0");

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
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.paymentLabel}>Payment method</Text>
        <View style={styles.paymentMethod}>
          <FontAwesome5 name="qrcode" size={20} color="black" />
          <Text style={styles.paymentText}>QR code</Text>
        </View>

        <View style={styles.paymentAmount}>
          <Text>Payment amount</Text>
          <Text style={styles.paymentAmountText}>฿ {parseFloat(amount).toFixed(2)}</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>CONFIRM</Text>
      </TouchableOpacity>
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
});
