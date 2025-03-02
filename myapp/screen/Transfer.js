import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal, FlatList } from "react-native";

export default function Transfer() {
  const [bank, setBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [showAmountSection, setShowAmountSection] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const banks = [
    { name: "Bangkok Bank (BBL)", value: "Bangkok Bank", logo: require("../assets/bangkok.png") },
    { name: "Kasikorn Bank (KBank)", value: "Kasikorn Bank", logo: require("../assets/kasikorn.png") },
    { name: "Krungthai Bank (KTB)", value: "Krungthai Bank", logo: require("../assets/krungthai.png") },
    { name: "Siam Commercial Bank (SCB)", value: "SCB", logo: require("../assets/scb.png") },
    { name: "TMBThanachart Bank (TTB)", value: "TTB", logo: require("../assets/ttb.png") },
    { name: "Government Savings Bank (GSB)", value: "GSB", logo: require("../assets/gsb.png") },
    { name: "Krungsri Bank (BAY)", value: "BAY", logo: require("../assets/krungsri.png") },
  ];

  const handleSelectBank = (selectedBank) => {
    setBank(selectedBank);
    setModalVisible(false);
  };

  const handleNext = () => {
    if (bank && accountNumber && accountHolder) {
      setShowAmountSection(true);
    }
  };

  return (
    <View style={styles.container}>
      {!showAmountSection && (
        <View style={styles.card}>
          <Text style={styles.label}>Destination account details</Text>
          <TouchableOpacity style={styles.bankPicker} onPress={() => setModalVisible(true)}>
            {bank ? (
              <View style={styles.selectedBank}>
                <Image source={banks.find(b => b.value === bank)?.logo} style={styles.bankLogo} />
                <Text style={styles.bankText}>{banks.find(b => b.value === bank)?.name}</Text>
              </View>
            ) : (
              <Text style={styles.bankPlaceholder}>Select Bank</Text>
            )}
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Account Number" keyboardType="numeric" value={accountNumber} onChangeText={setAccountNumber} />
          <TextInput style={styles.input} placeholder="Account holder's name" value={accountHolder} onChangeText={setAccountHolder} />
          <TouchableOpacity style={styles.confirmButton} onPress={handleNext}>
            <Text style={styles.confirmText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={banks}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.bankItem} onPress={() => handleSelectBank(item.value)}>
                  <Image source={item.logo} style={styles.bankLogo} />
                  <Text style={styles.bankText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
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
    marginBottom: 5,
  },
  bankPicker: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
  },
  selectedBank: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankPlaceholder: {
    fontSize: 16,
    color: "#888",
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 20, // ทำให้เป็นวงกลม
    marginRight: 10,
    resizeMode: "cover",
  },
  bankText: {
    fontSize: 16,
  },
  input: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#A2F193",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 20,
  },
  bankItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#A2F193",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
