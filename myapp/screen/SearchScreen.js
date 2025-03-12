import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Database from '../Model/database';
import DatabaseTimeslots from '../Model/datebase_ts';

export default function SearchScreen({ route, navigation }) {
    const courts = Database();
    const Timeslot = DatabaseTimeslots();
    const [
        filteredFields, setFilteredFields] = useState([]);
    const { searchQuery, court_type: RouteCourtType, priceslot: Routepriceslot, startTime: RoutestartTime, endTime: RouteendTime, date: Routedate } = route.params || {};
    const [court_type, setCourtType] = useState(RouteCourtType);
    const [priceslot, setPriceSlot] = useState(Routepriceslot);
    const [startTime, setStartTime] = useState(RoutestartTime ? new Date(RoutestartTime) : null);
    const [endTime, setEndTime] = useState(RouteendTime ? new Date(RouteendTime) : null);
    const [date, setDate] = useState(Routedate ? new Date(Routedate) : null);

    const formattedstartTime = startTime instanceof Date && !isNaN(startTime)
        ? startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '';

    const formattedendTime = endTime instanceof Date && !isNaN(endTime)
        ? endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : '';

    const formatteddate = date instanceof Date && !isNaN(date)
        ? date.toLocaleDateString('en-US', { weekday: 'long' })
        : '';

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
        if (date !== null && startTime !== null && endTime !== null) {
            const numericStartTime = parseInt(formattedstartTime.trim().replace(":", ""));
            const numericEndTime = parseInt(formattedendTime.trim().replace(":", ""));

            const filteredTimeslots = Timeslot.filter(slot => {
                if (!slot.time_start || !slot.time_end) return false;

                const slotStartTime = new Date(slot.time_start.seconds * 1000);
                const slotEndTime = new Date(slot.time_end.seconds * 1000);

                const formattedSlotStartTime = parseInt(slotStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(":", ""));
                const formattedSlotEndTime = parseInt(slotEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(":", ""));

                const dayOfWeek = formatteddate.toLowerCase();
                console.log("dayOfWeek: ", slot.availableDays[dayOfWeek])
                return formattedSlotStartTime <= numericStartTime &&
                    formattedSlotEndTime >= numericEndTime &&
                    slot.available === true &&
                    slot.availableDays[dayOfWeek];
            });

            const availableCourtIds = filteredTimeslots.map(slot => slot.court_id);

            console.log("availableCourtIds:", availableCourtIds);
            filtered = filtered.filter(field => availableCourtIds.includes(field.court_id));
        }

        setFilteredFields(filtered);
        console.log("Filtered Fields:", filtered);
    }, [searchQuery, court_type, priceslot, courts, startTime, endTime, date, Timeslot]);


    const handleFieldPress = (item) => {
        navigation.navigate('DetailScreen', { court_id: item.court_id });
    };

    const handleClose = () => {
        setCourtType(undefined);
    };

    const handleClose1 = () => {
        setPriceSlot(undefined);
    };

    const handleClose2 = () => {
        setStartTime(null);
        setEndTime(null);
        setDate(null);
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
                                Price 0 - {priceslot}</Text>
                            <Ionicons name="close-outline" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    )}
                    {date && startTime && endTime && (
                        <TouchableOpacity style={styles.fieldItem2} onPress={handleClose2}>
                            <Text style={styles.fieldName2}>
                                {formatteddate} {formattedstartTime} - {formattedendTime} </Text>
                            <Ionicons name="close-outline" size={20} style={styles.icon} />
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
            <FlatList
                data={filteredFields}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const matchingSlot = Timeslot.find(slot => slot.court_id === item.court_id);

                    const formattedTimeStart = matchingSlot && matchingSlot.time_start
                        ? new Date(matchingSlot.time_start.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                        : "N/A";

                    const formattedTimeEnd = matchingSlot && matchingSlot.time_end
                        ? new Date(matchingSlot.time_end.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                        : "N/A";

                    return (
                        <TouchableOpacity style={styles.card} onPress={() => handleFieldPress(item)}>
                            <Image
                                source={item.image && item.image[0] ? { uri: item.image[0] } : require('./images/dog.jpg')}
                                style={styles.image}
                            />
                            <View style={styles.cardContent}>
                                <Text style={styles.title}>{item.field}</Text>
                                <Text style={styles.text}>Time: {formattedTimeStart} - {formattedTimeEnd}</Text>
                                <Text style={styles.text}>Court Type: {item.court_type}</Text>
                                <Text style={styles.price}>Price: {item.priceslot} THB</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#555",
        marginBottom: 2,
    },
    price: {
        fontSize: 14,
        fontWeight: "600",
        color: "#009900",
        marginTop: 5,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        position: "relative",
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 6,
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 16,
    },
    containerfilter: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
