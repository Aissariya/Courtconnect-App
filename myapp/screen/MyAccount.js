import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MyAccount = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const userAuth = auth.currentUser;
  const storage = getStorage();

  const [isEditable, setIsEditable] = useState(false);
  const [user, setUser] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    profileImage: null,
  });
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added confirmPassword state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    if (!userAuth) {
      console.error("No user is logged in");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", userAuth.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          name: userData.name || "",
          surname: userData.surname || "",
          phone: userData.phone || "",
          email: userData.email || "",
          profileImage: userData.profileImage || null,
        });

        updateMissingFields(userAuth.uid, userData);
      } else {
        console.error("User data not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Update missing fields in Firestore if necessary
  const updateMissingFields = async (userId, userData) => {
    const updatedData = { ...userData };
    let hasUpdates = false;

    if (!userData.phone) {
      updatedData.phone = "";
      hasUpdates = true;
    }
    if (!userData.profileImage) {
      updatedData.profileImage = null;
      hasUpdates = true;
    }

    if (hasUpdates) {
      await setDoc(doc(db, "users", userId), updatedData, { merge: true });
    }
  };

  // Update user data in Firestore
  const updateUserData = async () => {
    if (!userAuth) {
      console.error("No user is logged in");
      return;
    }

    try {
      await setDoc(doc(db, "users", userAuth.uid), user, { merge: true });
      Alert.alert("Success", "Your information has been updated.");
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "There was an issue updating your information.");
    }
  };

  // Change password function
  const handleChangePassword = async () => {
    if (!userAuth) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "The new password must be at least 6 characters long.");
      return;
    }

    const credential = EmailAuthProvider.credential(userAuth.email, currentPassword);

    try {
      await reauthenticateWithCredential(userAuth, credential);
      console.log("✅ Reauthentication successful");

      await updatePassword(userAuth, newPassword);
      Alert.alert("Success", "Your password has been updated.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect current password.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Error", "The new password is too weak.");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("Error", "Invalid credentials. Please try again.");
      } else {
        Alert.alert("Error", "There was an issue changing your password. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    requestPermission();
  }, [userAuth]);

  // Request media library permissions
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "You need to allow access to photos to change your profile picture");
    }
  };

  // Handle profile image picker
// ฟังก์ชันเลือกและอัปโหลดรูป
const pickImage = async () => {
  if (!isEditable) return;

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const imageUrl = await uploadImageToStorage(uri);

    // อัปเดต state ในแอป
    setUser((prevState) => ({ ...prevState, profileImage: imageUrl }));

    // อัปเดต Firestore
    await updateProfileImageInFirestore(imageUrl);
  }
};

// ฟังก์ชันอัปโหลดรูปไป Firebase Storage
const uploadImageToStorage = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `profileImages/${userAuth.uid}.jpg`);
    await uploadBytes(imageRef, blob);

    const downloadUrl = await getDownloadURL(imageRef);
    console.log("✅ Image uploaded:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    return null;
  }
};

// ฟังก์ชันอัปเดต Firestore
const updateProfileImageInFirestore = async (imageUrl) => {
  if (!userAuth) {
    console.error("❌ No user is logged in");
    return;
  }

  try {
    await setDoc(doc(db, "users", userAuth.uid), { profileImage: imageUrl }, { merge: true });
    console.log("✅ Profile image updated in Firestore");
  } catch (error) {
    console.error("❌ Error updating profile image in Firestore:", error);
  }
};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={user.profileImage ? { uri: user.profileImage } : require("../assets/profile-user.png")}
              style={styles.profileImage}
            />
            {isEditable && (
              <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.profileName}>
            {user.name} {user.surname}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            editable={isEditable}
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            value={user.surname}
            onChangeText={(text) => setUser({ ...user, surname: text })}
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

        {/* Change Password button */}
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setIsPasswordModalVisible(true)}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Change Password
          </Text>
        </TouchableOpacity>

        {/* Edit/Save button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (isEditable) {
              updateUserData();
            }
            setIsEditable(!isEditable);
          }}
        >
          <Text style={styles.buttonText}>{isEditable ? "SAVE" : "EDIT"}</Text>
        </TouchableOpacity>

        {/* Password change modal */}
        <Modal
          visible={isPasswordModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPasswordModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>

              <View style={styles.passwordField}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Current Password"
                  placeholderTextColor="#d5d5d5"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? "eye-off" : "eye"}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordField}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  placeholderTextColor="#d5d5d5"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordField}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#d5d5d5"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>



              <TouchableOpacity
                style={styles.button}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Update Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsPasswordModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: 'white', fontFamily: 'YourFontName' }]}>Cancel</Text>

              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
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
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 10,
  },
  passwordInput: {
    backgroundColor: "#e3e3e3", // Set the background color for the password fields
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
  changePasswordButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center',

  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  cancelButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },

});


export default MyAccount;