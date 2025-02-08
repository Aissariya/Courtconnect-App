import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const NotificationScreen = () => {
    return (
        <View style={styles.content}>
            <Text>NotificationScreen</Text>
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

export default NotificationScreen