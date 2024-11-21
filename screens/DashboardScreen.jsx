import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDashboard from '../components/UserDashboard';
import DealerDashboard from '../components/DealerDashboard';
 

const DashboardScreen = () => {
  const [role, setRole] = useState(null); // Store the user role
  const [loading, setLoading] = useState(true); // Show loading while fetching role

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setRole(user?.user?.role); // Assuming role is a property in the stored user object
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    // Show a loader while fetching role
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      {role === 'CUSTOMER' && <UserDashboard />}
      {role === 'AGENT' && <DealerDashboard />}
      
      {!role && <Text style={styles.errorText}>Role not found. Please log in again.</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4650c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DashboardScreen;
