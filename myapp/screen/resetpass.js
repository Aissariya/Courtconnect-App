import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const resetpass = () => {
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const navigation = useNavigation();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Reset</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#FFFFFF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backToSignIn}>Back to sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Reset password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 70,

  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    textAlign: "left",
    marginBottom: 30,
  },
  backToSignIn: {
    fontSize: 14,
    marginBottom: 30,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#A2F193",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default resetpass;