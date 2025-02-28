import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import DetailScreen from '../screen/Detail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabNaVigator from './TapNavigetor';
import BookingSection from '../screen/Calandar';
import BookingScreen from '../screen/Booking';
import CommentScreen from '../screen/Comment';
import FilterScreen from '../screen/Filter';
import NotificationScreen from '../screen/Notification';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyAccount from '../screen/MyAccount';
import MyBookingScreen from '../screen/MyBook';
import BookingHistory from '../screen/BookingHistory';
import SignUp from '../screen/SignUp';
import SearchScreen from '../screen/SearchScreen';
import MyWallet from '../screen/MyWallet';
import { SearchBar, SearchBar2, SearchBar3, SearchBar4, Notificationbar } from './SearchBar';
import Deposit from '../screen/Deposit';

const Stack = createStackNavigator();

const screenOptions1 = () => ({
  headerStyle: { backgroundColor: '#A2F193' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerTitle: () => <SearchBar />,
  headerLeft: null,
});

const screenOptions2 = () => ({
  headerStyle: { backgroundColor: '#A2F193' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerTitle: () => <SearchBar2 />,
  headerLeft: null,
});

const screenOptions3 = () => ({
  headerStyle: { backgroundColor: '#A2F193' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerTitle: () => <SearchBar3 />,
  headerLeft: null,
});

const screenOptions4 = () => ({
  headerStyle: { backgroundColor: '#A2F193' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
  headerTitle: () => <SearchBar4 />,
  headerLeft: null,
});

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={TabNaVigator}
        name='MainTab'
        options={screenOptions1}
      />
      <Stack.Screen
        component={DetailScreen}
        name='DetailScreen'
        options={screenOptions2}
      />
      <Stack.Screen
        component={BookingSection}
        name='CalanderScreen'
        options={screenOptions2}
      />
      <Stack.Screen
        component={BookingScreen}
        name='BookingScreen'
        options={screenOptions2}
      />
      <Stack.Screen
        component={CommentScreen}
        name='CommentScreen'
        options={screenOptions2}
      />
      <Stack.Screen
        component={FilterScreen}
        name='FilterScreen'
        options={screenOptions3}
      />
      <Stack.Screen
        component={NotificationScreen}
        name='NotificationScreen'
        options={{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <Notificationbar />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={MyAccount}
        name='MyAccount'
        options={screenOptions2}
      />
      <Stack.Screen
        component={MyBookingScreen}
        name='MyBook'
        options={screenOptions2}
      />
      <Stack.Screen
        component={BookingHistory}
        name='BookingHistory'
        options={screenOptions2}
      />
      <Stack.Screen
        component={SearchScreen}
        name='SearchScreen'
        options={screenOptions4}
      />
      <Stack.Screen
        component={MyWallet}
        name='MyWallet'
        options={screenOptions4}
      />
      <Stack.Screen
        component={Deposit}
        name='Deposit'
        options={screenOptions4}
      />
    </Stack.Navigator>
  );
};

export default AppStack