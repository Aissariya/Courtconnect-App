import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { recommendedFields, TypeSport, sliderData } from '../Model/datatest';

export default function SearchScreen({ route, navigation }) {
    const [filteredFields, setFilteredFields] = useState([]);
    const { searchQuery, typeId: routeTypeId } = route.params || {};
    const [typeId, setTypeId] = useState(routeTypeId);

    const typeTitle = typeId
        ? TypeSport.find(type => type.typeId === typeId)?.title
        : null;

    useEffect(() => {
        let filtered = recommendedFields;
        console.log("searchQuery:", searchQuery);
        console.log("typeId:", typeId);

        if (typeId === 10) {
            filtered = filtered.filter(field => field.popular === true);
        } else {

            if (searchQuery) {
                filtered = filtered.filter(field =>
                    field.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            if (typeId !== undefined) {
                filtered = filtered.filter(field => field.typeId === typeId);
            }
        }
        console.log("Filtered Fields:", filtered);
        setFilteredFields(filtered);
    }, [searchQuery, typeId]);

    const handleFieldPress = (item) => {
        navigation.navigate('DetailScreen', { id: item.id });

    };

    const handleClose = () => {
        typeId
        setTypeId(undefined);
    };

    return (
        <View style={styles.container}>
            {typeTitle && (
                <TouchableOpacity style={styles.fieldItem2} onPress={handleClose}>
                    <Text style={styles.fieldName2}>{typeTitle}</Text>
                    <Ionicons name="close-outline" size={20} style={styles.icon} />
                </TouchableOpacity>
            )}
            <FlatList
                data={filteredFields}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.fieldItem} onPress={() => handleFieldPress(item)}>
                        <Ionicons name="location" size={20} style={styles.icon} />
                        <Text style={styles.fieldName}>{item.title}</Text>
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
