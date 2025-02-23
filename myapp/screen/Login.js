import { View, Text, StyleSheet ,TouchableOpacity} from 'react-native';
import React from 'react';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>Login screen</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')}
        style={{
          marginTop: 10,
          backgroundColor: '#A2F193',
          padding: 20,
          width: '30%',
          borderRadius: 5,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('SignUp')}
        style={{
          marginTop: 10,
          backgroundColor: '#A2F193',
          padding: 20,
          width: '30%',
          borderRadius: 5,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
          Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  content: {
    fontSize: 24,
  },
});

export default Login;