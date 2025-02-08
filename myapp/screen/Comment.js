import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CommentScreen = () => {
    return (
        <View style={styles.container}>
            {/* ใช้ ScrollView เพื่อให้สามารถเลื่อนขึ้นลงได้ */}
            <ScrollView style={styles.detailsContainer}>
                {/* แถบสีดำที่มีคำว่า Score และ 5 ดาว */}
                <View style={styles.scoreBar}>
                    <Text style={styles.scoreText}>Score ★★★★★</Text>
                </View>

                {/* รีวิวสนาม */}
                <View style={styles.reviewContainer}>
                    {/* รีวิว 1 */}
                    <View style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>John Doe</Text>
                        <Text style={styles.reviewText}>สนามบาสดีมาก บรรยากาศเยี่ยม และการดูแลรักษาสนามดีเยี่ยม</Text>
                        <View style={styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                <Text key={index} style={styles.star}>★</Text>
                            ))}
                        </View>
                    </View>

                    {/* รีวิว 2 */}
                    <View style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>Jane Smith</Text>
                        <Text style={styles.reviewText}>สนามบาสสะอาดและมีอุปกรณ์ครบครัน สะดวกสบายมากๆ</Text>
                        <View style={styles.starContainer}>
                            {[...Array(4)].map((_, index) => (
                                <Text key={index} style={styles.star}>★</Text>
                            ))}
                        </View>
                    </View>
                </View><View style={styles.reviewContainer}>
                    {/* รีวิว 1 */}
                    <View style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>John Doe</Text>
                        <Text style={styles.reviewText}>สนามบาสดีมาก บรรยากาศเยี่ยม และการดูแลรักษาสนามดีเยี่ยม</Text>
                        <View style={styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                <Text key={index} style={styles.star}>★</Text>
                            ))}
                        </View>
                    </View>

                    {/* รีวิว 2 */}
                    <View style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>Jane Smith</Text>
                        <Text style={styles.reviewText}>สนามบาสสะอาดและมีอุปกรณ์ครบครัน สะดวกสบายมากๆ</Text>
                        <View style={styles.starContainer}>
                            {[...Array(4)].map((_, index) => (
                                <Text key={index} style={styles.star}>★</Text>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.reviewContainer}>
                    {/* รีวิว 1 */}
                    <View style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>John Doe</Text>
                        <Text style={styles.reviewText}>สนามบาสดีมาก บรรยากาศเยี่ยม และการดูแลรักษาสนามดีเยี่ยม</Text>
                        <View style={styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                <Text key={index} style={styles.star}>★</Text>
                            ))}
                        </View>
                    </View>

                    {/* รีวิว 2 */}
                    <View style={styles.reviewBox}>
                        <Text style={styles.reviewerName}>Jane Smith</Text>
                        <Text style={styles.reviewText}>สนามบาสสะอาดและมีอุปกรณ์ครบครัน สะดวกสบายมากๆ</Text>
                        <View style={styles.starContainer}>
                            {[...Array(4)].map((_, index) => (
                                <Text key={index} style={styles.star}>★</Text>
                            ))}
                        </View>
                    </View>
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
    scoreBar: {
        flexDirection: 'row',
        backgroundColor: 'black',
        width: '100%', // ชิดขอบจอทั้งสองฝั่ง
        paddingVertical: 10,
        alignItems: 'flex-start', // ชิดซ้าย
        justifyContent: 'space-between',

    },
    scoreText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10, // เพิ่มช่องว่างซ้ายให้ชิดซ้าย
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
        backgroundColor: '#f4f4f4',
        padding: 15,
        marginBottom: 15,
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
    star: {
        color: '#FFD700', // สีดาวเป็นทอง
        fontSize: 18,
        marginRight: 3,
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
});
export default CommentScreen