import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import Home from '../screen/Home';
import DetailScreen from '../screen/Detail';
import NotificationScreen from '../screen/Notification';
import AccountScreen from '../screen/Account';
import MyAccount from '../screen/MyAccount';
import MyBookingScreen from '../screen/MyBook';
import Login from '../screen/Login';
import BookingScreen from '../screen/Booking';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BookingSection from '../screen/Calandar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                component={Home}
                name="Home" />
            <Stack.Screen
                component={DetailScreen}
                name="DetailScreen" />
        </Stack.Navigator>
    );
};

const DetailStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                component={DetailScreen}
                name="DetailScreen" />
        </Stack.Navigator>
    );
};

const TabNaVigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tab.Screen
                name='Home'
                component={HomeStack}
                options={({ route }) => ({
                    tabBarStyle: { display: getTabbarVisibility(route), backgroundColor: '#A2F193' },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                })}
            />
            <Tab.Screen
                name='Account'
                component={AccountScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name='My Booking'
                component={MyBookingScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name='Exit'
                component={Login}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="exit" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const TabNaVigator2 = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#666',
            }}
        >
            <Tab.Screen
                name='Home'
                component={DetailStack}
                options={({ route }) => ({
                    tabBarStyle: { display: getTabbarVisibility(route), backgroundColor: '#A2F193' },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                })}
            />
            <Tab.Screen
                name='Calander'
                component={BookingSection}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name='Booking'
                component={BookingScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const getTabbarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';
    if (routeName === 'DetailScreen') {
        return 'none';
    }
    return 'flex';
};

const styles = {
    tabBarStyle: {
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: '#A2F193',
    },
};

export default TabNaVigator;