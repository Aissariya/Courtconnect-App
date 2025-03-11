import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Database from '../Model/database';
import DataComment from '../Model/database_c';
import DataUser from '../Model/database_u';
import { AverageRating } from "../context/AverageRating";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { checkCommented, handleDeleteComment } from "../context/checkCommented";
import { Menu, Divider } from 'react-native-paper';

const CommentScreen = ({ route }) => {
    const auth = getAuth();
    const courts = Database();
    const { court_id } = route.params || {};
    const comments = DataComment(court_id);
    const userData = DataUser(comments);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            setIsLoading(false);  // ถ้ามีข้อมูล userNames แล้ว ให้หยุดโหลด
        }
    }, [userData]);

    if (isLoading) {
        return (
            <View style={styles.loadcontainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const averageRating = AverageRating(comments);

    return (
        <View style={styles.container}>
            {/* ใช้ ScrollView เพื่อให้สามารถเลื่อนขึ้นลงได้ */}
            <ScrollView style={styles.detailsContainer}>
                {/* แถบสีดำที่มีคำว่า Score และ 5 ดาว */}
                <View style={styles.scoreBar}>
                    <Text style={styles.scoreText}>
                        Score
                    </Text>
                    <Text style={styles.scoreIcon}>
                        {[...Array(Math.round(averageRating))].map((_, index) => (
                            <Text key={index} style={styles.star}>★</Text>
                        ))}
                    </Text>
                    <Text style={styles.averageRatingText}>({averageRating})</Text>
                </View>

                {/* รีวิวสนาม */}
                <View>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <View key={comment.id} style={styles.reviewBox}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={
                                                userData[comment.id]?.profileImage
                                                    ? { uri: userData[comment.id].profileImage }
                                                    : require("../assets/profile-user.png")
                                            }
                                            style={styles.profileImage}
                                        />
                                        <Text style={styles.reviewerName}>{userData[comment.id]?.name || "Loading..."}</Text>
                                        <View style={styles.starContainer}>
                                            {[...Array(comment.rating)].map((_, index) => (
                                                <Text key={index} style={styles.star}>★</Text>
                                            ))}
                                        </View>
                                        <Text style={styles.rateText}>({comment.rating}.0) </Text>
                                    </View>
                                    {auth.currentUser && comment.user_id === auth.currentUser.uid && (
                                        <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                                            <MaterialCommunityIcons
                                                name="dots-vertical"
                                                size={15}
                                                color="#000"
                                                style={{ marginTop: 5 }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <Text style={styles.dateText}>
                                    {comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }) : "No date"}
                                </Text>
                                <Text style={styles.reviewText}>{comment.text} </Text>
                                <View style={styles.separator} />
                            </View>
                        ))
                    ) : (
                        <View style={styles.box} />
                    )}
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 0,
        backgroundColor: 'white',
    },
    detailsContainer: {
        width: '100%',
    },
    detailsTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '100%',
    },
    priceBox: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start', // ชิดซ้าย
    },
    priceText: {
        color: '#A2F193',
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailsText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'left',
    },
    rating: {
        color: "gray",
        marginLeft: 5,
        marginTop: 5,
    },
    scoreBar: {
        flexDirection: 'row',
        backgroundColor: 'black',
        width: '100%', // ชิดขอบจอทั้งสองฝั่ง
        paddingVertical: 10,
        alignItems: 'flex-start', // ชิดซ้าย


    },
    scoreText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10, // เพิ่มช่องว่างซ้ายให้ชิดซ้าย
    },
    scoreIcon: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 5, // เพิ่มช่องว่างซ้ายให้ชิดซ้าย
    },
    scoreText2: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: 4,
        paddingRight: 10, // เพิ่มช่องว่างซ้ายให้ชิดขวา
    },
    reviewContainer: {
        marginTop: 10,
        width: '100%',
    },
    reviewBox: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rateText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 3,
    },
    dateText: {
        fontSize: 12,
        color: '#333',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 10,
    },
    starContainer: {
        marginTop: -3,
        flexDirection: 'row',
    },
    star: {
        color: '#00000', // สีดาวเป็นทอง
        fontSize: 18,
        // marginRight: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        zIndex: 2, // ทำให้ปุ่มอยู่เหนือเนื้อหาที่เลื่อน
    },
    calanderButton: {
        flex: 1, // ปุ่มกินพื้นที่ครึ่งหนึ่งของจอ
        borderColor: 'black',
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    calanderText: {
        color: 'black',
        fontWeight: 'bold',
    },
    bookingButton: {
        flex: 2, // ปุ่มกินพื้นที่ครึ่งหนึ่งของจอ
        borderColor: 'black',
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'black',
        alignItems: 'center',
    }, bookingView: {
        flexDirection: 'row',
        padding: '10'
    },
    bookingText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loadcontainer: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    averageRatingText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: 4,
        paddingLeft: 10,
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: "#ddd",
        marginRight: 10,
    },
});
export default CommentScreen