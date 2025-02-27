import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
/*import { auth } from "./firebaseConfig";*/
/*import { signInWithEmailAndPassword } from "firebase/auth";*/
import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../context/AuthContext";

const Login = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");

      login();
      // ไปยังหน้าหลักหรือ Dashboard
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("./images/logo.png")} style={styles.logo} />

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Create Account */}
      <Text style={styles.newUserText}>
        new to Courtconnect?{" "}
        <Text style={styles.createAccountText} onPress={() => navigation.navigate("SignUp")}>
          create an account here!
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 280,
    height: 290,
    marginBottom: 30,
    marginTop: -160,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 50,
    color: "#fff",
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#B1F77E",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    marginVertical: 10,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  forgotPassword: {
    color: "black",
    marginVertical: 40,
  },
  newUserText: {
    color: "black",
    marginTop: 20,
  },
  createAccountText: {
    fontWeight: "bold",
    color: "black",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Login;