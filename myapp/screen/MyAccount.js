import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MyAccount = () => {
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState({
    firstName: "Krit",
    lastName: "Soodchuien",
    password: "************",
    phone: "075-63854463",
    email: "Krit.soo@ku.th",
  });

  const handleChange = (field, value) => {
    setUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Account</Text>
      </View>

      {/* Profile Section without Image */}
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>
          {user.firstName} {user.lastName}
        </Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name account</Text>
        <TextInput
          style={styles.input}
          value={user.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
          editable={isEditable}
        />

        <Text style={styles.label}>Surname account</Text>
        <TextInput
          style={styles.input}
          value={user.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
          editable={isEditable}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={user.password}
          secureTextEntry
          onChangeText={(text) => handleChange("password", text)}
          editable={isEditable}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={user.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange("phone", text)}
          editable={isEditable}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
          editable={isEditable}
        />
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isEditable) {
            console.log("User data saved:", user);
          }
          setIsEditable(!isEditable);
        }}
      >
        <Text style={styles.buttonText}>{isEditable ? "SAVE" : "EDIT"}</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  profileSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#A2F193",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyAccount;
