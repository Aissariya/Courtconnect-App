import React from 'react';
import { NavigationContainer } from '@react-navigation/native';


import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import AppNav from './navigation/AppNav';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  )
}

export default App;

