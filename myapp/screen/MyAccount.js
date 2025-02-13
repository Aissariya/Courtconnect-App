import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MyAccount = () => {
  const navigation = useNavigation();
  const [isEditable, setIsEditable] = useState(false); // ควบคุมโหมดการแก้ไข
  const [user, setUser] = useState({
    firstName: "Krit",
    lastName: "Soodchuien",
    password: "************",
    phone: "075-63854463",
    email: "Krit.soo@ku.th",
  });

  // URL ของรูปภาพที่จะแสดง
  const profileImageUrl = "https://via.placeholder.com/100"; // หรือสามารถใส่ URL ของรูปโปรไฟล์ที่ต้องการได้

  // Handle input change for each field
  const handleChange = (field, value) => {
    setUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header (เหมือนกับ Account.js) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Account</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.profileName}>
          {user.firstName} {user.lastName}
        </Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={user.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          value={user.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          value={user.password}
          secureTextEntry
          onChangeText={(text) => handleChange("password", text)}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          value={user.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange("phone", text)}
          editable={isEditable}
        />
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
            // If in editable mode, save the changes
            console.log("User data saved:", user);
          }
          setIsEditable(!isEditable); // Toggle between edit and save mode
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginHorizontal: 20,
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
