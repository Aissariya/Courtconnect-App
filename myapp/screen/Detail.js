import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Database from '../Model/database';
import DataComment from '../Model/database_c';
import DataUser from '../Model/database_u';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { AverageRating } from "../context/AverageRating";


export default function Detail({ route, navigation }) {
  const auth = getAuth();
  const db = getFirestore();
  const courts = Database();
  const { court_id } = route.params || {};
  const comments = DataComment(court_id);
  const userData = DataUser(comments);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  console.log('court_id:', court_id);


  const item = courts.find(item => item.court_id === court_id);
  if (!item) {
    return (
      <View style={styles.loadcontainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const averageRating = AverageRating(comments);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (userId) {
      try {
        const newComment = {
          user_id: userId,
          court_id: court_id,
          rating: rating,
          text: text,
          timestamp: serverTimestamp(),
        };

        const commentRef = await addDoc(collection(db, "Comment"), newComment);

        await updateDoc(doc(db, "Comment", commentRef.id), {
          comment_id: commentRef.id,
        });

        alert("Comment submitted successfully!");
        setText("");
        setRating(0);
      } catch (error) {
        console.error("Error adding comment: ", error);
        alert("Failed to submit comment.");
      }
    } else {
      alert("User not authenticated.");
    }
  };

  const titlename = item ? item.field : "test";
  const mainImage = item ? { uri: item.image[0] } : require('../assets/pingpong.jpg');
  const subImages = item ? item.image.slice(1) : [];
  const price = item ? item.priceslot : "500";
  const court = item ? item.court_type : "Null";

  return (
    <View style={styles.container}>
      <ScrollView style={styles.detailsContainer}>
        <Image source={mainImage} style={styles.mainImage} resizeMode="cover" />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.smallImagesContainer}>
            {subImages.map((imageUri, index) => (
              <TouchableOpacity key={index}>
                <Image source={{ uri: imageUri }} style={styles.smallImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.detailsTitle}>{titlename}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 5, marginRight: 5 }}>
            {[...Array(Math.round(averageRating))].map((_, index) => (
              <Text key={index} style={styles.star1}>★</Text>
            ))}
          </View>
          <Text style={styles.detailsTitle}>({averageRating})</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.priceText}>Price {price} per hour</Text>
        </View>
        <Text style={styles.detailsText}>
          Field type: {court}{"\n"}
          Facilities: locker room, shower room{"\n"}
          Business hours: Open every day 8:00 - 14:00{"\n"}
          Terms and conditions:{"\n"}
          - Users must follow the rules and regulations of the field.{"\n"}
          - If you want to cancel your reservation, you should notify in advance according to the specified period.{"\n"}
          - Use of the field must be careful to ensure the safety of all players.{"\n"}
          Payment: Can pay through various channels
        </Text>

        <View style={styles.scoreBar}>
          <View style={{ flexDirection: 'row' }}>
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
          <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { court_id })}>
            <Text style={styles.scoreText2}>showmore</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Comment..."
          placeholderTextColor="black"
          multiline={true}
          maxLength={150}
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <View style={styles.ratingContainer}>
          {/* Rating and Stars */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <MaterialCommunityIcons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={20}
                  color="#FFFFF"
                  style={{ marginTop: 5 }}
                />
              </TouchableOpacity>
            ))}
            <Text style={styles.rating}>Rating: {rating} / 5</Text>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={styles.counter}>{text.length} / 150</Text>
            <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {comments.length > 0 ? (
            comments.slice(0, 3).map((comment) => (
              <View key={comment.id} style={styles.reviewBox}>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.calanderButton}
          onPress={() => navigation.navigate('MainTab')}
          activeOpacity={1}
        >
          <MaterialCommunityIcons name='home' size={20} color='#000' />
          <Text style={styles.calanderText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CalanderScreen', {
            court: {
              court_id: item.court_id,
              field: item.field,
              image: item.image,
              address: item.address
            }
          })}
          style={styles.calendarButton}
        >
          <MaterialCommunityIcons name='calendar' size={20} color='#000' />
          <Text style={{ fontWeight: 'bold' }}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => navigation.navigate('BookingScreen', { court: item })}
          activeOpacity={1}
        >
          <View style={styles.bookingView}>
            <MaterialCommunityIcons name='cart' size={20} color='#fff' />
            <Text style={styles.bookingText}>Booking</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#00000', // สีดาวเป็นทอง
    fontSize: 18,
    // marginRight: 1,
  },
  star1: {
    color: '#00000', // สีดาวเป็นทอง
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
});
