import { View, Text ,ImageBackground,TouchableOpacity} from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Start = ({ navigation }) => {
    return (
        <ImageBackground 
          source={require('../assets/football.jpg')} 
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(128, 128, 128, 0.8)',
            width: '100%',
          }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#fff' }}>
              COURTCONNECT
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={{
                marginTop: 10,
                backgroundColor: '#A2F193',
                padding: 20,
                width: '80%',
                borderRadius: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
                Let start!
              </Text>
              <MaterialIcons name='arrow-forward-ios' size={22} color='#000' />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      );
}

export default Start