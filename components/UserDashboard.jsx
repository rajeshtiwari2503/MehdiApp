


import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Text, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you use React Navigation
import http_request from "../http_request"; // Assuming this is your HTTP request module
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; // Adjust import as per your structure
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');



const UserDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [design, setDesign] = useState([]);

  const navigation = useNavigation();
  const router = useRouter();

  const scrollRef = useRef(null);  // ScrollView reference
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle the auto-scroll for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= design.length) nextIndex = 0;  // Reset to first image

      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 3000);  // Change slide every 3 seconds

    return () => clearInterval(interval);  // Cleanup interval on component unmount

  }, [activeIndex]);
  useEffect(() => {
    const fetchStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchStoredUser();
    fetchDesigns()
  }, []);
  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      const userD = JSON.parse(storedUser);
      const response = await http_request.get(`/getAllMehndiDesign`);
      const { data } = response;
      // const filData = userD?.user?.role === "AGENT" ? data?.filter((f) => f?.agentId === userD?.user?._id) : data?.filter((f) => f?.customerId === userD?.user?._id);

      setDesign(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching designs:", error);
    }
  };
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const tab = [
    { name: "Track Location", icon: "location-outline", type: "Ionicons", bgColor: "#1abc9c", navigate: "Dashboard" },
    { name: "Order", icon: "shopping-cart", type: "MaterialIcons", bgColor: "#e74c3c", navigate: "Order" },
    { name: "Group Order", icon: "group", type: "FontAwesome", bgColor: "#3498db", navigate: "groupOrder" },
    { name: "Mehndi Design", icon: "brush", type: "MaterialIcons", bgColor: "#f39c12", navigate: "Design" },
    { name: "Offer & Discount", icon: "pricetag", type: "Ionicons", bgColor: "#9b59b6", navigate: "Dashboard" },
    { name: "Helpline & Chat", icon: "chatbox-ellipses", type: "Ionicons", bgColor: "#34495e", navigate: "Support" }
  ];

  const handleOrder = async (item) => {
    // console.log(item);

    const orderData = { item, user };
    if (user) {
      await AsyncStorage.setItem("orderM", JSON.stringify(orderData));
      if (item?.groupOrder === true) {
        navigation.navigate("groupOrder");
      } else {
        navigation.navigate("Order");

      }

    } else {
      Alert.alert("Login Required", "Please log in to place an order.", [
        { text: "Login", onPress: () => navigation.navigate("SignIn") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };
  // console.log(design);

  return (


    <ScrollView  style={styles.carouselContainer} >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.iconButton}
          >
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>S Mehndi है जहाँ खुशियाँ हैं वहाँ</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            style={styles.iconButton}
          >
            <FontAwesome name="user-circle-o" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        </View>
        {/* Image Carousel */}
        {loading === true ?
          <ActivityIndicator size="large" color="#0000ff" />
          :
          
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {design.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleOrder(item)}  >
                  <View key={item?._id || index} style={styles.carouselItem}>
                    {/* Image */}
                    <Image source={{ uri: item.image }} style={styles.image} />

                    {/* Overlay Container */}
                    <View style={styles.overlayContainer}>
                      {/* Name on the Image */}
                      <Text style={styles.label}>{item.name}</Text>

                      {/* Pagination Dots */}
                      <View style={styles.paginationContainer}>
                        {design.map((_, dotIndex) => (
                          <View
                            key={dotIndex}
                            style={[
                              styles.dot,
                              index === dotIndex ? styles.activeDot : styles.inactiveDot,
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
           
        }




        {/* Product Summary */}
        <ScrollView style={styles.container}>
          <View style={styles.headerContent}>
            <View style={styles.summaryContainer}>
              {tab?.map((item, index) => {
                return (
                  <View key={index} style={styles.itemContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate(item?.navigate)}
                      style={[styles.button, { backgroundColor: item.bgColor }]}

                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                       
                        {item.type === "Ionicons" && <Ionicons name={item.icon} size={24} color="white" />}
                        {item.type === "MaterialIcons" && <MaterialIcons name={item.icon} size={24} color="white" />}
                        {item.type === "FontAwesome" && <FontAwesome name={item.icon} size={24} color="white" />}
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.productName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    elevation: 3, // Gives shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 10,
    marginBottom: 10

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  iconButton: {
    padding: 4,
  },
  content: {
    padding: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  itemContainer: {
    width: '48%',
    backgroundColor: '#17A2B8',
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderRadius: 10,
  },
  productName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  warrantyStatus: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  carouselContainer: {
    flex: 1,
    // padding:10,
    backgroundColor: '#f8f8f8',
  },
  carouselItem: {
    width, // Full screen width for each item
    height: 180, // Adjust the height as needed
    borderRadius: 20,
    marginTop:10,
    overflow: 'hidden', // Ensures content stays within borders
    position: 'relative', // Needed for absolute positioning of overlay
  },
  image: {
    width: '100%', // Stretch to full container width
    height: '100%', // Stretch to full container height
    resizeMode: 'cover', // Maintain aspect ratio while covering
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end', // Align content at the bottom
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Optional dark overlay for better text visibility
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Spacing from pagination
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },

  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: { 
    backgroundColor: '#e74c3c', // Active dot color
    width: 10, // Customize the size if needed
    height: 10,
    borderRadius: 5,
    margin: 4,
  },
  inactiveDot: {
    backgroundColor: '#34495e', // Inactive dot color
    width: 8, // Slightly smaller size for inactive dots
    height: 8,
    borderRadius: 4,
    margin: 4,
  },
});

export default UserDashboard;
