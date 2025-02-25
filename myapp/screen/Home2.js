import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView } from 'react-native';

export default function Home2({ navigation }) {
  return (
    <View style={styles.container}>
      {/* แถบค้นหา */}
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="ค้นหาสนาม..." placeholderTextColor="#fff" />
      </View>

      <ScrollView>
        {/*Near Me*/}
        <Section title="Near me" image={require('../assets/basketball.jpg')} />

        {/*Popular*/}
        <Section title="Popular" image={require('../assets/basketball.jpg')} />

        {/*Football*/}
        <Section title="Football" image={require('../assets/football.jpg')} />
      </ScrollView>
    </View>
  );
}


const Section = ({ title, image, recommended }) => (
  <View>
    <View style={styles.sectionHeader}>
      <Text style={styles.headfont}>{title}</Text>
      <Text style={styles.showMore}>showmore </Text>
    </View>
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      {recommended && <View style={styles.recommendTag}><Text style={styles.recommendText}>แนะนำ</Text></View>}
      <Text style={styles.courtName}>สนามกีฬาหนองงูเห่า</Text>
    </View>
  </View>
);

// 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A2F193',
  },
  searchBar: {
    backgroundColor: '#000',
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  searchInput: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  headfont: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  showMore: {
    color: '#0aada8',
    marginTop: 5,
  },
  card: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
  },
  recommendTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  recommendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  courtName: {
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
