import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Start from '../screen/Start';
import LoginScreen from '../screen/Login';
import SignUp from '../screen/SignUp';
import resetpass from '../screen/resetpass';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        component={Start} 
        name='Start'
      />
      <Stack.Screen 
        component={LoginScreen} 
        name='Login'
      />
      <Stack.Screen 
        component={SignUp} 
        name='SignUp'
      />
      <Stack.Screen 
        component={resetpass} 
        name='resetpass'
      />
    </Stack.Navigator>
  );
};

export default AuthStack;