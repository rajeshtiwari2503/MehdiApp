 


import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you use React Navigation
import http_request from "../http_request"; // Assuming this is your HTTP request module
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'; // Adjust import as per your structure
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const images = [
  { id: 1, src: require('../assets/images/Logo.png'), label: 'Product 1' },
  { id: 2, src: require('../assets/images/Logo.png'), label: 'Product 2' },
  { id: 3, src: require('../assets/images/Logo.png'), label: 'Product 3' },
];

const DealerDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState("");
  const navigation = useNavigation();
  const router = useRouter();

  const scrollRef = useRef(null);  // ScrollView reference
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle the auto-scroll for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= images.length) nextIndex = 0;  // Reset to first image

      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 3000);  // Change slide every 3 seconds

    return () => clearInterval(interval);  // Cleanup interval on component unmount
  }, [activeIndex]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const tab = [
    { name: "Track Location", icon: "location-outline", type: "Ionicons", bgColor: "#1abc9c",navigate:"Dashboard" },
    { name: "Order", icon: "shopping-cart", type: "MaterialIcons", bgColor: "#e74c3c",navigate:"Order" },
    // { name: "Group Order", icon: "group", type: "FontAwesome", bgColor: "#3498db",navigate:"groupOrder" },
    // { name: "Mehndi Design", icon: "brush", type: "MaterialIcons", bgColor: "#f39c12",navigate:"Design" },
    { name: "Offer & Discount", icon: "pricetag", type: "Ionicons", bgColor: "#9b59b6",navigate:"Dashboard" },
    { name: "Helpline & Chat", icon: "chatbox-ellipses", type: "Ionicons", bgColor: "#34495e" ,navigate:"Support"}
  ];
    return (
    
    
      <ScrollView   >
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
        {/* Image Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((item, index) => (
            <View key={item.id} style={styles.carouselItem}>
              <Image source={item.src} style={styles.image} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#000' : '#ccc' },
              ]}
            />
          ))}
        </View>

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
                      {/* Render icon based on the icon type */}
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
        </View>
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
    marginBottom:10
  
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
  carouselItem: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default DealerDashboard;
