import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import UserNavigator from './UserNavigation';
import DealerNavigator from './DealerNavigation';
import TechnicianNavigator from './TechnicianNavigation';
import Login from "../components/Login";
import { useFonts } from 'expo-font';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   
  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

 

 

  useEffect(() => {
    async function prepare() {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync(); // Keep splash screen visible
      } else {
        await SplashScreen.hideAsync(); // Hide splash screen when fonts are loaded
      }
    
    }
    prepare();
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log('Error retrieving user data', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [fontsLoaded]);

  if (loading || !fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
console.log(user);

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
