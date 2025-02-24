import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import { windowWidth, windowHeight } from '../utils/Dimensions';
import { recommendedFields } from '../Model/datatest';
export default function Home({ navigation }) {
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
