import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you use React Navigation
import http_request from "../http_request"; // Assuming this is your HTTP request module
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDashboard from '../components/UserDashboard';
 
 

const DashboardScreen = () => {
 
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <UserDashboard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4650c',
    paddingBottom: 5,
    paddingTop: 5,
  } 
  
});

export default DashboardScreen;