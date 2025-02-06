import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const FilterScreen = () => {
    return (
        <View style={styles.content}>
            <Text>FilterScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default FilterScreen