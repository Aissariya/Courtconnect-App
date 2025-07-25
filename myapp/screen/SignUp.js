import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { auth, db } from '../FirebaseConfig';
import { Wallet } from 'lucide-react-native';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isCustomer, setIsCustomer] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const nameRegex = /^[A-Za-z\u0E00-\u0E7F]+$/;

    switch (name) {
      case "email":
        if (!emailRegex.test(value)) {
          error = "Invalid email format!";
        }
        break;
      case "password":
        if (!passwordRegex.test(value)) {
          error = "Password must be at least 8 characters long and contain both uppercase and lowercase letters!";
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          error = "Passwords do not match!";
        }
        break;
      case "name":
        if (!nameRegex.test(value)) {
          error = "Name must contain only letters!";
        }
        break;
      case "surname":
        if (!nameRegex.test(value)) {
          error = "Surname must contain only letters!";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateInputs = () => {
    let newErrors = {};

    newErrors.email = validateField("email", email);
    newErrors.password = validateField("password", password);
    newErrors.confirmPassword = validateField("confirmPassword", confirmPassword);
    newErrors.name = validateField("name", name);
    newErrors.surname = validateField("surname", surname);

    setErrors(newErrors);
    return Object.keys(newErrors).every(key => !newErrors[key]); // คืนค่า true ถ้าไม่มี error
  };

  const generateNextUserId = async () => {
    try {
      console.log('Generating next user ID...');
      const usersRef = collection(db, "users");
      

      const usersSnapshot = await getDocs(usersRef);
      let maxNumber = 0;
  

      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.user_id && userData.user_id.startsWith('COS')) {
          const currentNumber = parseInt(userData.user_id.replace('COS', ''));
          if (!isNaN(currentNumber) && currentNumber > maxNumber) {
            maxNumber = currentNumber;
          }
        }
        if (userData.wallet_id && userData.wallet_id.startsWith('W')) {
          const walletNumber = parseInt(userData.wallet_id.replace('W', ''));
          if (!isNaN(walletNumber) && walletNumber > maxNumber) {
            maxNumber = walletNumber;
          }
        }
      });

      const nextNumber = maxNumber + 1;
      console.log('Next number will be:', nextNumber);
  

      const userId = `COS${nextNumber.toString().padStart(4, '0')}`;
      const walletId = `W${nextNumber.toString().padStart(4, '0')}`;
  

      const checkUserIdQuery = query(usersRef, where('user_id', '==', userId));
      const checkWalletIdQuery = query(usersRef, where('wallet_id', '==', walletId));
      
      const [userIdSnapshot, walletIdSnapshot] = await Promise.all([
        getDocs(checkUserIdQuery),
        getDocs(checkWalletIdQuery)
      ]);
  
      if (!userIdSnapshot.empty || !walletIdSnapshot.empty) {
        console.log('ID conflict detected, trying next number');

        return generateNextUserId();
      }
  
      console.log('Generated new IDs:', { userId, walletId });
      return { userId, walletId };
  
    } catch (error) {
      console.error('Error generating IDs:', error);
      throw error;
    }
  };

  const handleSignup = async () => {
    if (!validateInputs()) {
      return;
    }
  
    try {
      const { userId, walletId } = await generateNextUserId();
      console.log('Creating new user with IDs:', { userId, walletId });
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  

      await setDoc(doc(db, "users", user.uid), {
        user_id: userId,
        email: email,
        name: name,
        surname: surname,
        isCustomer: isCustomer,
        wallet_id: walletId,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "Wallet", user.uid), {
        amount: 0,
        balance: 0,
        wallet_id: walletId,
        status: "",
      });
  
      console.log('Signup completed successfully');
      navigation.pop();
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
    paddingVertical: 8,
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