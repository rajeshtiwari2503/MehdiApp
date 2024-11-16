import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import UserNavigator from './UserNavigation';
import DealerNavigator from './DealerNavigation';
 
import Login from "../components/Login";
import { useFonts } from 'expo-font';
import OrderScreen from '../screens/OrderScreen';
import GroupOrderDesign from './groupOrder';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);

  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Error retrieving user data', error);
      }
    };

    checkUser();
  }, []);

  if (!fontsLoaded) {
    console.log("Fonts not loaded yet.");
    // You can return null or some basic component if you want something to render before fonts load
    return null;
  }
  if (fontsLoaded) {
    console.log("Fonts successfully loaded.");
    
  }

  return (
    <>
      {!fontsLoaded ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        
        <Stack.Navigator  screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#0000ff', 
          //  marginTop:-50  
          },
        }}>
          {user ? (
            <>
              {user?.user?.role === 'CUSTOMER' && <Stack.Screen name="User" component={UserNavigator} />}
              {user?.user?.role === 'AGENT' && <Stack.Screen name="Dealer" component={DealerNavigator} />}
           
              {user?.user?.role === undefined && <Stack.Screen name="RoleSelection" component={Login} />}
             
             
      
            </>
          ) : (
            <Stack.Screen name="RoleSelection" component={Login} />
          )}
           <Stack.Screen name="groupOrder" component={GroupOrderDesign} />
        </Stack.Navigator>
        
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    background:"#0000ff",
    alignItems: 'center',
  },
});

export default AppNavigator;
