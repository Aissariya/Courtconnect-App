import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Database from '../Model/database';

export default function SearchScreen({ route, navigation }) {
    const courts = Database();
    const [filteredFields, setFilteredFields] = useState([]);
    const { searchQuery, court_type: RouteCourtType, priceslot: Routepriceslot, startTime: RoutestartTime, endTime: RouteendTime, date: Routedate } = route.params || {};
    const [court_type, setCourtType] = useState(RouteCourtType);
    const [priceslot, setPriceSlot] = useState(Routepriceslot);
    const [startTime, setStartTime] = useState(new Date(RoutestartTime));
    const [endTime, setEndTime] = useState(new Date(RouteendTime));
    const [date, setDate] = useState(new Date(Routedate));

    const formattedstartTime = startTime instanceof Date ? startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // ใช้ 24 ชั่วโมง
    }) : '';

    const formattedendTime = endTime instanceof Date ? endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // ใช้ 24 ชั่วโมง
    }) : '';

    const formatteddate = date instanceof Date ? date.toLocaleDateString("en-CA") : '';


    useEffect(() => {
        let filtered = courts;
        console.log("priceslot:", priceslot);
        if (searchQuery) {
            filtered = filtered.filter(field =>
                field.field.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (court_type !== undefined) {
            filtered = filtered.filter(field => field.court_type === court_type);
        }
        if (priceslot !== undefined) {
            filtered = filtered.filter(field => field.priceslot <= priceslot);
        }
        if (startTime !== undefined && endTime !== undefined) {

        }
        if (date !== undefined) {

        }

        setFilteredFields(filtered);
        console.log("Filtered Fields:", filtered);
    }, [searchQuery, court_type, priceslot, courts, startTime, endTime, date]);

    const handleFieldPress = (item) => {
        navigation.navigate('DetailScreen', { court_id: item.court_id });
    };

    const handleClose = () => {
        setCourtType(undefined);
    };

    const handleClose1 = () => {
        setPriceSlot(undefined);
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerfilter}>
                <ScrollView horizontal={true} style={styles.scrollContainer} showsHorizontalScrollIndicator={false}>
                    {court_type && (
                        <TouchableOpacity style={styles.fieldItem2} onPress={handleClose}>
                            <Text style={styles.fieldName2}>{court_type}</Text>
                            <Ionicons name="close-outline" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    )}
                    {priceslot && (
                        <TouchableOpacity style={styles.fieldItem2} onPress={handleClose1}>
                            <Text style={styles.fieldName2}>
                                Price below {priceslot}</Text>
                            <Ionicons name="close-outline" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    )}
                    {startTime && endTime && (
                        <TouchableOpacity style={styles.fieldItem2} onPress={handleClose1}>
                            <Text style={styles.fieldName2}>
                                {formattedstartTime} : {formattedendTime} </Text>
                            <Ionicons name="close-outline" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    )}
                    {date && (
                        <TouchableOpacity style={styles.fieldItem2} onPress={handleClose1}>
                            <Text style={styles.fieldName2}>
                                Date: {formatteddate}</Text>
                            <Ionicons name="close-outline" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
            <FlatList
                data={filteredFields}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.fieldItem} onPress={() => handleFieldPress(item)}>
                        <Ionicons name="location" size={20} style={styles.icon} />
                        <Text style={styles.fieldName}>{item.field}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
    },
    containerfilter: {
        flexDirection: 'row', // Align items in a column (vertical)
        alignItems: 'flex-start', // Align items to the left
    },
    fieldItem: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 8,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fieldItem2: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 8,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
        alignSelf: 'flex-start',
        marginRight: 5,
    },
    fieldName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    fieldName2: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: "bold",
    },

    icon: {
        marginRight: 10,
        color: "black"
    },
    icon: {
        marginRight: 5,
        color: "black"
    },
});
