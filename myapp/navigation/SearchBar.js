import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

export const SearchBar = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container2}>
            <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
                <Ionicons name="notifications" size={25} style={styles.icon2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('SearchScreen')}>
                <Ionicons name="search" size={20} style={styles.icon} />
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="#fff"
                    style={{ color: 'white' }}
                    editable={false}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
                <Ionicons name="filter" size={25} style={styles.icon2} />
            </TouchableOpacity>
        </View>
    );
};

export const SearchBar2 = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container2}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={25} style={styles.icon2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('SearchScreen')}>
                <Ionicons name="search" size={20} style={styles.icon} />
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="white"
                    editable={false}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
                <Ionicons name="filter" size={25} style={styles.icon2} />
            </TouchableOpacity>
        </View>
    );
};

export const SearchBar3 = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container2}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={25} style={styles.icon2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('SearchScreen')}>
                <Ionicons name="search" size={20} style={styles.icon} />
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="white"
                    editable={false}
                />
            </TouchableOpacity>
            <Ionicons name="filter" size={25} style={styles.icon3} />
        </View>
    );
};

export const SearchBar4 = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [searchText, setSearchText] = useState('');

    const { typeId } = route.params || {};

    const handleSearch = (text) => {
        setSearchText(text);
        navigation.navigate('SearchScreen', { searchQuery: text, typeId });
    };

    return (
        <View style={styles.container2}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={25} style={styles.icon2} />
            </TouchableOpacity>
            <View style={styles.container} >
                <Ionicons name="search" size={20} style={styles.icon} />
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="white"
                    value={searchText}
                    onChangeText={handleSearch}
                    style={{ color: 'white' }}
                />
            </View>
            <Ionicons name="filter" size={25} style={styles.icon3} />
        </View>
    );
};
export const Notificationbar = () => {
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
});