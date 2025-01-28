import React  from 'react';
import AppNavigator from '../AppNavigation';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
 
export default function Home() {
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
  return (
  
    <AppNavigator />
 
  );
}