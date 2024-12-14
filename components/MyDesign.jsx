import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request';
import { useNavigation } from '@react-navigation/native';

const MyDesign = ({ retOrder }) => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('Service'); // State for managing tabs
  const [designs, setDesigns] = useState([]);
  const [customerDesigns, setCustomerDesigns] = useState([]); // For Customer Designs
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchStoredUser();
    fetchDesigns();
    fetchCustomerDesigns(); // Fetch customer designs as well
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await http_request.get('/getAllMehndiCategory');
      setDesigns(response.data);
    } catch (error) {
      console.error('Error fetching service designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDesigns = async () => {
    try {
      setLoading(true);
      const response = await http_request.get('/getAllMehndiCategory'); // Replace with actual API endpoint
      setCustomerDesigns(response.data);
    } catch (error) {
      console.error('Error fetching customer designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (item) => {
    const orderData = { item, user };
    if (user) {
      await AsyncStorage.setItem('orderM', JSON.stringify(orderData));
      navigation.navigate('Order');
      if (retOrder) {
        retOrder();
      }
    } else {
      Alert.alert('Login Required', 'Please log in to place an order.', [
        { text: 'Login', onPress: () => navigation.navigate('SignIn') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'Service' && styles.activeTab]}
          onPress={() => setTab('Service')}
        >
          <Text style={styles.tabText}>Service Design</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'Customer' && styles.activeTab]}
          onPress={() => setTab('Customer')}
        >
          <Text style={styles.tabText}>Customer Design</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : tab === 'Service' ? (
          <View style={styles.grid}>
            {designs.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                // onPress={() => handleOrder(item)}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={styles.imageBackground}
                  imageStyle={{ borderRadius: 8 }}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.cardTitle}>{item.categoryName}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            {customerDesigns.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => handleOrder(item)}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  style={styles.imageBackground}
                  imageStyle={{ borderRadius: 8 }}
                >
                  <View style={styles.overlay}>
                    <Text style={styles.cardTitle}>{item.categoryName}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 30,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E90FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  content: {
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
  },
  imageBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default MyDesign;
