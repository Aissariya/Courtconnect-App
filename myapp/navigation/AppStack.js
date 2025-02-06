import { View ,StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import React from 'react'
import DetailScreen from '../screen/Detail';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabNaVigator from './TapNavigetor';
import CalanderScreen from '../screen/Calander';
import BookingScreen from '../screen/Booking';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
            component={CalanderScreen} 
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
    </Stack.Navigator>
  )
}

const SearchBar = () => {
  return (
    <View style={styles.container2}>
      <Ionicons name="notifications"size={25} style={styles.icon2} />
       <View style={styles.container}>
              <Ionicons name="search" size={20} style={styles.icon} />
      <TextInput 
        placeholder="Search..."
        placeholderTextColor="#fff"
        style={{ color: 'white' }}
      />
      </View>
      <Ionicons name="filter"size={25} style={styles.icon2} />
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
      <Ionicons name="filter"size={25} style={styles.icon2} />
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
    marginBottom:10,
  },
  icon: {
    marginRight: 10,
    color:"white"
  },
  icon2: {
    margin: 10,
    color:"black"
  },
  input: {

    flex: 1,
    color: 'white',
  },
})
export default AppStack