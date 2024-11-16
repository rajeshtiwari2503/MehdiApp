import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request'; // Replace with your actual HTTP request setup
import { useNavigation } from '@react-navigation/native';

const MyDesign = ({ retOrder }) => {
  // console.log(retOrder);
  
  const navigation = useNavigation();
  const [designs, setDesigns] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchStoredUser();
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await http_request.get("/getAllMehndiCategory");
      setDesigns(response.data);
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (item) => {
    const orderData = { item, user };
    if (user) {
      await AsyncStorage.setItem("orderM", JSON.stringify(orderData));
      navigation.navigate("Order");
     if(retOrder){
      retOrder();
     } 
    } else {
      Alert.alert("Login Required", "Please log in to place an order.", [
        { text: "Login", onPress: () => navigation.navigate("SignIn") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}>Our Services</Text> */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.grid}>
          {designs.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleOrder(item)} style={styles.card}>
              <ImageBackground
                source={{ uri: item.image }}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.overlay}>
                  <Text style={styles.cardTitle}>{item.categoryName}</Text>
                  {/* <Text style={styles.price}>{item.price}</Text> */}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 16,
    textAlign: 'center',
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
  price: {
    fontSize: 16,
    color: '#fff',
  },
});

export default MyDesign;
