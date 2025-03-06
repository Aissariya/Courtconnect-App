import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
    profileImage: null,
  });

  // ฟังก์ชันขออนุญาตเข้าถึงแกลเลอรี
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "ต้องอนุญาตให้เข้าถึงรูปภาพเพื่อเปลี่ยนโปรไฟล์");
    }
  };

  useEffect(() => {
    requestPermission();  // เรียกขออนุญาตเมื่อเข้าหน้าจอ
  }, []);

  // ฟังก์ชันเลือกรูปภาพจากแกลเลอรี
  const pickImage = async () => {
    if (!isEditable) return; // ถ้าไม่ใช่โหมดแก้ไข จะไม่สามารถเลือกภาพได้

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ใช้ MediaTypeOptions
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser((prevState) => ({ ...prevState, profileImage: result.assets[0].uri }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user.profileImage
                ? { uri: user.profileImage }
                : require("../assets/profile-user.png")
            }
            style={styles.profileImage}
          />
          {isEditable && (
            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.profileName}>
          {user.firstName} {user.lastName}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name account</Text>
        <TextInput
          style={styles.input}
          value={user.firstName}
          onChangeText={(text) => setUser({ ...user, firstName: text })}
          editable={isEditable}
        />

        <Text style={styles.label}>Surname account</Text>
        <TextInput
          style={styles.input}
          value={user.lastName}
          onChangeText={(text) => setUser({ ...user, lastName: text })}
          editable={isEditable}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={user.password}
          secureTextEntry
          onChangeText={(text) => setUser({ ...user, password: text })}
          editable={isEditable}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={user.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => setUser({ ...user, phone: text })}
          editable={isEditable}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          keyboardType="email-address"
          onChangeText={(text) => setUser({ ...user, email: text })}
          editable={isEditable}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (isEditable) {
            console.log("User data saved:", user);
          }
          setIsEditable(!isEditable); // เปลี่ยนสถานะของ isEditable
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
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#A2F193",
    borderRadius: 15,
    padding: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
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
