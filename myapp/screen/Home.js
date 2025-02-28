import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { windowWidth } from '../utils/Dimensions';
import { recommendedFields } from '../Model/datatest';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function Home({ navigation }) {
  const [courts, setCourts] = useState([]);
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courtSnapshot = await getDocs(collection(db, 'Court'));
        if (!courtSnapshot.empty) {
          setCourts(courtSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching courts: ", error);
      }
    };

    fetchCourts();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginBottom: 20,
            backgroundColor: 'white'
          }}
        >
          <Text style={styles.headfont}>
            Near Me!
          </Text>
          <FlatList
            data={recommendedFields.filter(item => item.near === true)}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground source={item.image} style={styles.image}>
                <TouchableOpacity
                  style={{ flex: 1, width: '100%' }}
                  onPress={() => navigation.navigate('DetailScreen', { id: item.id })}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'red',
                    padding: 5,
                    width: 85,
                    borderRadius: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    Recomend
                  </Text>
                </View>
              </ImageBackground>
            )}
          />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center",
          }}>
            <Text style={styles.headfont}>
              Popular
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { typeId: 10 })}>
              <Text style={{ color: '#0aada8', marginRight: 10, marginTop: 20 }}>
                showmore
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedFields.filter(item => item.popular === true)}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground source={item.image} style={styles.image}>
                <TouchableOpacity
                  style={{ flex: 1, width: '100%' }}
                  onPress={() => navigation.navigate('DetailScreen', { id: item.id })}
                />
              </ImageBackground>
            )}
          />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center",
          }}>
            <Text style={styles.headfont}>
              Football
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { typeId: 1 })}>
              <Text style={{ color: '#0aada8', marginRight: 10, marginTop: 20 }}>
                showmore
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedFields.filter(item => item.typeId === 1)}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground source={item.image} style={styles.image}>
                <TouchableOpacity
                  style={{ flex: 1, width: '100%' }}
                  onPress={() => navigation.navigate('DetailScreen', { id: item.id })}
                />
              </ImageBackground>
            )}
          />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: "center",
          }}>
            <Text style={styles.headfont}>
              Basketball
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { typeId: 2 })}>
              <Text style={{ color: '#0aada8', marginRight: 10, marginTop: 20 }}>
                showmore
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedFields.filter(item => item.typeId === 2)}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground source={item.image} style={styles.image}>
                <TouchableOpacity
                  style={{ flex: 1, width: '100%' }}
                  onPress={() => navigation.navigate('DetailScreen', { id: item.id })}
                />
              </ImageBackground>
            )}
          />
          <FlatList
            data={courts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.text}>Address: {item.address || "N/A"}</Text>
                <Text style={styles.text}>Booking Slot: {item.bookingslot || 60} min</Text>
                <Text style={styles.text}>Capacity: {item.capacity || "N/A"}</Text>
                <Text style={styles.text}>Court ID: {item.court_id || "c01"}</Text>
                <Text style={styles.text}>Type: {item.court_type || "football"}</Text>
                <Text style={styles.text}>Field: {item.field || "test1"}</Text>
                <Text style={styles.text}>Price Slot: {item.priceslot || 1500} THB</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headfont: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    margin: 10,
    width: windowWidth - 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
});
