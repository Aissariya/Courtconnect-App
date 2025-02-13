import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import DetailScreen from '../screen/Detail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabNaVigator from './TapNavigetor';
import BookingSection from '../screen/Calandar';
import BookingScreen from '../screen/Booking';
import CommentScreen from '../screen/Comment';
import FilterScreen from '../screen/Filter';
import NotificationScreen from '../screen/Notification';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyAccount from '../screen/MyAccount';
import MyBookingScreen from '../screen/MyBook';
import BookingHistory from '../screen/BookingHistory';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={TabNaVigator}
        name='Home'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={DetailScreen}
        name='DetailScreen'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar2 />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={BookingSection}
        name='CalanderScreen'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar2 />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={BookingScreen}
        name='BookingScreen'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar2 />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={CommentScreen}
        name='CommentScreen'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar2 />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={FilterScreen}
        name='FilterScreen'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar3 />,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={NotificationScreen}
        name='NotificationScreen'
        options=
        {{
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
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar/>,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={MyBookingScreen}
        name='MyBook'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar2/>,
          headerLeft: null,
        }}
      />
      <Stack.Screen
        component={BookingHistory}
        name='BookingHistory'
        options=
        {{
          headerStyle: { backgroundColor: '#A2F193' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitle: () => <SearchBar2/>,
          headerLeft: null,
        }}
      />
 
    </Stack.Navigator>
  )
}

const SearchBar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container2}>
      <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
        <Ionicons name="notifications" size={25} style={styles.icon2} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Ionicons name="search" size={20} style={styles.icon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#fff"
          style={{ color: 'white' }}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
        <Ionicons name="filter" size={25} style={styles.icon2} />
      </TouchableOpacity>
    </View>
  );
};

const SearchBar2 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container2}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={25} style={styles.icon2} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Ionicons name="search" size={20} style={styles.icon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="white"
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
        <Ionicons name="filter" size={25} style={styles.icon2} />
      </TouchableOpacity>
    </View>
  );
};

const SearchBar3 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container2}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={25} style={styles.icon2} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Ionicons name="search" size={20} style={styles.icon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="white"
        />
      </View>

      <Ionicons name="filter" size={25} style={styles.icon3} />

    </View>
  );
};

const Notificationbar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container2}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={25} style={styles.icon2} />
      </TouchableOpacity>
      <Text style={styles.fontheader}>Notification</Text>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    paddingHorizontal: 15,
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    color: "white"
  },
  icon2: {
    margin: 10,
    color: "black"
  },
  icon3: {
    margin: 10,
    color: "#A2F193"
  },
  input: {
    flex: 1,
    color: 'white',
  },
  fontheader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'

  },
})
export default AppStack