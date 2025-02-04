import { View, Text, StyleSheet ,TouchableOpacity} from 'react-native';
import React from 'react';


export default function DetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
          <Text style={styles.content}>Detail screen</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('CalanderScreen')}
            style=
            {{
              marginTop: 10,
              backgroundColor: '#A2F193',
              padding: 20,
              width: '30%',
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
              calander
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('BookingScreen')}
            style=
            {{
              marginTop: 10,
              backgroundColor: '#A2F193',
              padding: 20,
              width: '30%',
              borderRadius: 5,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
              Booking
            </Text>
          </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  content: {
    fontSize: 24,
  },
});
