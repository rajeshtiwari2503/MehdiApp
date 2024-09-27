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
  }, []);

 

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
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
              {user?.user?.role === 'USER' && <Stack.Screen name="User" component={UserNavigator} />}
              {user?.user?.role === 'DEALER' && <Stack.Screen name="Dealer" component={DealerNavigator} />}
              {user?.user?.role === 'TECHNICIAN' && <Stack.Screen name="Technician" component={TechnicianNavigator} />}
              {/* {user?.user?.role === 'SERVICE' && user?.user?.serviceCenterType === 'Independent' && (
              <Stack.Screen name="Technician" component={TechnicianNavigator} />
            )} */}
              {user?.user?.role === 'SERVICE' && <Stack.Screen name="RoleSelection" component={Login} />}
              {user?.user?.role === 'BRAND' && <Stack.Screen name="RoleSelection" component={Login} />}
              {user?.user?.role === 'ADMIN' && <Stack.Screen name="RoleSelection" component={Login} />}
              
              {/* Add more roles and components as needed */}
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
