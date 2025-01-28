import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, Alert, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import Login from "../components/Login";
import { useFonts } from 'expo-font';
import * as MediaLibrary from 'expo-media-library';

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // setUser(false);
        }
      } catch (error) {
        console.log('Error retrieving user data', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  useEffect(() => {
    if (!fontsLoaded) {
      console.log("Fonts not loaded yet.");
      setLoading(false);
    } else {
      console.log("Fonts successfully loaded.");
      setLoading(false);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        // Requesting permissions for Android (photo/video)
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

        if (mediaStatus !== 'granted') {
          Alert.alert(
            "Permission Required",
            "This app needs access to your photos and videos to function properly. Please grant permission in your settings."
          );
        }
      } else if (Platform.OS === 'ios') {
        // Requesting permissions for iOS (photo)
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();

        if (mediaStatus !== 'granted') {
          Alert.alert(
            "Permission Required",
            "This app needs access to your photos to function properly. Please grant permission in your settings."
          );
        }
      }
    };

    requestPermissions();
  }, []);

  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View  >
      {!user && <Login />}
    </View>
  );
}