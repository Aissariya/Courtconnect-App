import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isCustomer, setIsCustomer] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // เก็บ error ของ input แต่ละช่อง
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let newErrors = {};
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format!";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 8 characters!";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    if (name.trim() === "") {
      newErrors.name = "Name is required!";
    }
    if (surname.trim() === "") {
      newErrors.surname = "Surname is required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มี error
  };

  const handleSignup = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        surname,
        isCustomer,
        createdAt: serverTimestamp(),
      });

      console.log("Signup successful!");
      navigation.pop(); // กลับไปหน้า login
    } catch (err) {
      console.error("Signup failed:", err.message);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Sign up</Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="black" />
          <TextInput
            style={styles.input}
            placeholder="E-mail:"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="rgba(105, 105, 105, 0.35)"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Password:"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="rgba(105, 105, 105, 0.35)"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password:"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="rgba(105, 105, 105, 0.35)"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        {/* Switch Customer/Owner }
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => setIsCustomer(!isCustomer)}
        >
          <Text style={styles.statusButtonText}>
            {isCustomer ? "You Are Now Customer" : "You Are Now Owner"}
          </Text>
        </TouchableOpacity*/}

        {/* Name */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name:"
            value={name}
            onChangeText={setName}
            placeholderTextColor="rgba(105, 105, 105, 0.35)"
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Surname */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Surname:"
            value={surname}
            onChangeText={setSurname}
            placeholderTextColor="rgba(105, 105, 105, 0.35)"
          />
        </View>
        {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.signInText}>
          Already had an account?
          <Text
            style={styles.signInLink}
            onPress={() => navigation.pop()}
          > Sign in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  container: {
    width: '80%',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A2F193',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical:8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 10,
    color: '#000',
  },
  signInLink: {
    color: '#00A86B',
    fontWeight: 'bold',
  }
});

export default SignUp;