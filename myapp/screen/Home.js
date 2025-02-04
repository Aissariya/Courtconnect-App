import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, } from 'react-native';
import DetailScreen from './Detail';

export default function Home({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            flexDirection:'column',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
        <Text style={styles.headfont}>
          Near Me!
        </Text>
        <ImageBackground 
          source={require('../assets/football.jpg')} 
          style={{
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            width:  335,
            height: 150
          }}>
            <TouchableOpacity
              style={{ flex: 1, width: '100%' }} 
              onPress={() => navigation.navigate('DetailScreen')} // เมื่อกดจะไปที่หน้า Detail
            />
            <View
            style=
            {{
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
            style=
              {{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#fff'
              }}
            >
              Recomend
            </Text>
          </View>
          </ImageBackground>
          <View style=
            {{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: "center",
            }}
            >
            <Text style={styles.headfont}>
              Popular
            </Text>
            <TouchableOpacity>
              <Text style={{color: '#0aada8', marginRight: 10 ,marginTop:20}}>
                showmore
              </Text> 
            </TouchableOpacity>
          </View>
          <ImageBackground 
            source={require('../assets/swim.jpg')} 
            style={{
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
              width:  335,
              height: 150
            }}>
          </ImageBackground>
          <View style=
            {{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: "center",
            }}
            >
            <Text style={styles.headfont}>
              Football
            </Text>
            <TouchableOpacity>
              <Text style={{color: '#0aada8', marginRight: 10 ,marginTop:20}}>
                showmore
              </Text> 
            </TouchableOpacity>
          </View>
          <ImageBackground 
            source={require('../assets/football.jpg')} 
            style={{
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
              width:  335,
              height: 150
            }}>
          </ImageBackground>
          <View style=
            {{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: "center",
            }}
            >
            <Text style={styles.headfont}>
              Basketball
            </Text>
            <TouchableOpacity>
              <Text style={{color: '#0aada8', marginRight: 10 ,marginTop:20}}>
                showmore
              </Text> 
            </TouchableOpacity>
          </View>
          <ImageBackground 
            source={require('../assets/basketball.jpg')} 
            style={{
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
              width:  335,
              height: 150
            }}>
          </ImageBackground>
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
  }
});
