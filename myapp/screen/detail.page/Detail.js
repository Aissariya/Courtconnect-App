import React, { useEffect, useState, RefreshControl, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import Database from '../../Model/database';
import DataComment from '../../Model/database_c';
import DataUser from '../../Model/database_u';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { AverageRating } from "../../context/AverageRating";
import Detailstyles from './Detailstyles';
import { checkCommented } from '../../context/checkCommented';
import DatabaseTimeslots from "../../Model/datebase_ts";

export default function Detail({ route, navigation }) {
  const auth = getAuth();
  const db = getFirestore();
  const courts = Database();
  const Timeslot = DatabaseTimeslots();
  const { court_id } = route.params || {};
  const comments = DataComment(court_id) || [];
  const userData = DataUser(comments) || {};
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // console.log('court_id:', court_id);
  if (!userData) {
    return (
      <View style={Detailstyles.loadcontainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const item = courts.find(item => item.court_id === court_id);
  if (!item) {
    return (
      <View style={Detailstyles.loadcontainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        setLoading(true);

        const hasCommented = await checkCommented(court_id, userId);

        if (hasCommented) {
          setLoading(false);
          alert("You have already commented on this court.");
          return;
        }
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
        setRating(5);
        setLoading(false);
        navigation.replace('DetailScreen', { court_id });
      } catch (error) {
        console.error("Error adding comment: ", error);
        alert("Failed to submit comment.");
        setLoading(false);
      }
    } else {
      alert("User not authenticated.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, "Comment", commentId);
      await deleteDoc(commentRef);
      alert("Comment deleted successfully!");
      console.log("Comment deleted successfully!");
      setLoading(false);
      navigation.replace('DetailScreen', { court_id });
    } catch (error) {
      console.error("Error deleting comment: ", error);
      alert("Failed to delete comment.");
    }
  };
  const titlename = item ? item.field : "test";
  const mainImage = item ? { uri: item.image[0] } : require('../images/dog.jpg');
  const subImages = item ? item.image.slice(1) : [];
  const price = item ? item.priceslot : "500";
  const court = item ? item.court_type : "Null";
  const address = item ? item.address : "Null";
  const Capacity = item ? item.capacity : "Null";

  const matchingSlot = Timeslot.find(slot => slot.court_id === item.court_id);
  if (!matchingSlot) {
    return (
      <View style={Detailstyles.loadcontainer}>
        <Text>ไม่พบเวลาในการจอง</Text>
      </View>
    );
  }
  const formattedTimeStart = new Date(matchingSlot.time_start.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const formattedTimeEnd = new Date(matchingSlot.time_end.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <View style={Detailstyles.container}>
      <ScrollView style={Detailstyles.detailsContainer}>
        <Image source={mainImage} style={Detailstyles.mainImage} resizeMode="cover" />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={Detailstyles.smallImagesContainer}>
            {subImages.map((imageUri, index) => (
              <TouchableOpacity key={index}>
                <Image source={{ uri: imageUri }} style={Detailstyles.smallImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={Detailstyles.detailsTitle}>{titlename}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 5, marginRight: 5 }}>
            {[...Array(Math.round(averageRating))].map((_, index) => (
              <Text key={index} style={Detailstyles.star1}>★</Text>
            ))}
          </View>
          <Text style={Detailstyles.detailsTitle}>({averageRating})</Text>
        </View>
        <View style={Detailstyles.priceBox}>
          <Text style={Detailstyles.priceText}>Price {price} per hour</Text>
        </View>
        <Text style={Detailstyles.detailsText}>
          Court Type: {court}{"\n"}
          Location: {address}{"\n"}
          Capacity: {Capacity}{"\n"}
          Facilities: Locker Room, Shower Room{"\n"}
          Operating Hours: Open Daily {formattedTimeStart} - {formattedTimeEnd}{"\n"}
          Payment: Can pay through various channels
        </Text>

        <View style={Detailstyles.scoreBar}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={Detailstyles.scoreText}>
              Score
            </Text>
            <Text style={Detailstyles.scoreIcon}>
              {[...Array(Math.round(averageRating))].map((_, index) => (
                <Text key={index} style={Detailstyles.star}>★</Text>
              ))}
            </Text>
            <Text style={Detailstyles.averageRatingText}>({averageRating})</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', { court_id, fromDetailScreen: true })}>
            <Text style={Detailstyles.scoreText2}>showmore</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Comment..."
          placeholderTextColor="black"
          multiline={true}
          maxLength={150}
          value={text}
          onChangeText={setText}
          style={Detailstyles.input}
        />
        <View style={Detailstyles.ratingContainer}>
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
            <Text style={Detailstyles.rating}>Rating: {rating} / 5</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={Detailstyles.counter}>{text.length} / 150</Text>
            <TouchableOpacity style={Detailstyles.submit} onPress={handleSubmit} disabled={loading}>{loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                Submit
              </Text>
            )}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {comments.length > 0 ? (
            comments.slice(0, 3).map((comment) => (
              <View key={comment.id} style={Detailstyles.reviewBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={
                        userData[comment.id]?.profileImage
                          ? { uri: userData[comment.id].profileImage }
                          : require("../../assets/profile-user.png")
                      }
                      style={Detailstyles.profileImage}
                    />
                    <Text style={Detailstyles.reviewerName}>{userData[comment.id]?.name || "Loading..."}</Text>
                    <View style={Detailstyles.starContainer}>
                      {[...Array(comment.rating)].map((_, index) => (
                        <Text key={index} style={Detailstyles.star}>★</Text>
                      ))}
                    </View>
                    <Text style={Detailstyles.rateText}>({comment.rating}.0) </Text>
                  </View>
                  {auth.currentUser && comment.user_id === auth.currentUser.uid && (
                    <TouchableOpacity onPress={() => handleDeleteComment(comment.id)} disabled={loading}>{loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={15}
                        color="#000"
                        style={{ marginTop: 5 }}
                      />
                    )}
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={Detailstyles.dateText}>
                  {comment.timestamp ? new Date(comment.timestamp.seconds * 1000).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : "No date"}
                </Text>
                <Text style={Detailstyles.reviewText}>{comment.text} </Text>
                <View style={Detailstyles.separator} />
              </View>
            ))
          ) : (
            <View style={Detailstyles.box} />
          )}
        </View>
      </ScrollView>

      <View style={Detailstyles.buttonContainer}>
        <TouchableOpacity
          style={Detailstyles.calanderButton}
          onPress={() => navigation.navigate('MainTab')}
          activeOpacity={1}
        >
          <MaterialCommunityIcons name='home' size={20} color='#000' />
          <Text style={Detailstyles.calanderText}>Home</Text>
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
          style={Detailstyles.calendarButton}
        >
          <MaterialCommunityIcons name='calendar' size={20} color='#000' />
          <Text style={{ fontWeight: 'bold' }}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Detailstyles.bookingButton}
          onPress={() => navigation.navigate('BookingScreen', { court: item })}
          activeOpacity={1}
        >
          <View style={Detailstyles.bookingView}>
            <MaterialCommunityIcons name='cart' size={20} color='#fff' />
            <Text style={Detailstyles.bookingText}>Booking</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
