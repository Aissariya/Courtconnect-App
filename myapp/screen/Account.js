import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, RefreshControl, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export default function Account({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [walletAmount, setWalletAmount] = useState("0.00");
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = () => {
    setModalVisible(false);
    logout();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
            <Card title="My Wallet" icon="wallet-outline" subText={`${walletAmount} THB`} onPress={() => navigation.navigate("MyWallet")} />
          </Section>
        </View>

        {/* Logout Button */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Logout Confirmation Modal */}
        <Modal
          animationType="fade" // Change animationType to "fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Are you sure</Text>
              <Text style={styles.modalText}>You want to log out?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={confirmLogout}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
  },
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
    color: "black"
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "black",
  },
  confirmButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
