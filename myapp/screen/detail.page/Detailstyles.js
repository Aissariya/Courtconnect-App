import { StyleSheet } from 'react-native';

const Detailstyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        paddingTop: 0,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginTop: 10,
    },
    averageRatingText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: 4,
        paddingLeft: 10,
    },
    loadcontainer: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    mainImage: {
        width: '100%',
        height: 250,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
    },
    smallImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
        width: '100%',
        // paddingHorizontal: 10,
    },
    smallImage: {
        width: 50,
        height: 50,
        margin: 5,
    },
    detailsContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 10,
        marginBottom: 70,
    },
    detailsTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    priceBox: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
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
        marginTop: 20, // เพิ่มช่องว่างระหว่างข้อความกับแถบสีดำ
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
        marginTop: 20,
        width: '100%',
    },
    reviewBox: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5
    },
    reviewText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
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
    starContainer: {
        marginTop: -3,
        flexDirection: 'row',
    },
    star: {
        color: '#00000',
        fontSize: 18,
        // marginRight: 1,
    },
    star1: {
        color: '#00000',
        fontSize: 18,
        marginTop: 5,
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
    calendarButton: {
        flex: 1, // ปุ่มกินพื้นที่ครึ่งหนึ่งของจอ
        borderColor: 'black',
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    bookingButton: {
        flex: 2, // ปุ่มกินพื้นที่ครึ่งหนึ่งของจอ
        borderColor: 'black',
        borderWidth: 2,
        paddingVertical: 10,
        backgroundColor: 'black',
        alignItems: 'center',
    },
    bookingView: {
        flexDirection: 'row',
        padding: '10'
    },
    bookingText: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        marginTop: 10,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: "#fff",
        color: "black",
        height: 100,
        textAlignVertical: "top",
    },
    counter: {
        color: 'gray',
        marginTop: -20,
    },
    submit: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 5,
        marginTop: -20,
        // marginBottom: 20,
    },
    ratingContainer: {
        width: '100%',
        flexDirection: 'column',
    },
    rating: {
        color: "gray",
        marginLeft: 5,
        marginTop: 5,
    },
    box: {
        marginBottom: 15,
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: "#ddd",
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: '#FF6347',  // สีแดง
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

});

export default Detailstyles;
