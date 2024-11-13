import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, ScrollView, RefreshControl, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request';
import DesignSection from './Designs';

const MyOrders = ({ route }) => {
  const [tab, setTab] = useState('Designs');
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [myOrder, setMyOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());

  useEffect(() => {
    const retrieveData = async () => {
      const storedOrder = await AsyncStorage.getItem("orderM");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedOrder) setOrder(JSON.parse(storedOrder));
      if (storedUser) setUser(JSON.parse(storedUser));

      fetchDesigns();
    };

    retrieveData();
  }, [refresh]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      const userD = JSON.parse(storedUser);
      const response = await http_request.get(`/getAllOrder`);
      const { data } = response;
      const filData = data?.filter((f) => f?.customerId === userD?.user?._id);

      setMyOrder(filData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching designs:", error);
    }
  };

  const handleCreateOrder = async () => {
    if (!order || !user) {
      Alert.alert("Error", "Order or user details are missing.");
      return;
    }

    const orderData = {
      name: user?.user?.name,
      customerId: user?.user?._id,
      email: user?.user?.email,
      contact: user?.user?.contact,
      address: user?.user?.address,
      agentName: "Agent Name Here",
      agentId: "Agent ID Here",
      design: order?.item?.name,
      price: order?.item?.price,
    };

    try {
      setLoading(true);
      await http_request.post('/addOrder', orderData);

      await AsyncStorage.removeItem("orderM");
      setRefresh(Math.random());
      setOrder(null);
      setIsOrderCreated(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Error creating order.");
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setOrder(null);
    setIsOrderCreated(false);
    fetchDesigns();
    setRefresh(Math.random());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const retOrder = () => {
     setTab("Orders")
     onRefresh()
  };

  return (
    <>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab('Designs')} style={[styles.tabButton, tab === 'Designs' && styles.activeTab]}>
          <Text style={styles.tabText}>Designs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Orders')} style={[styles.tabButton, tab === 'Orders' && styles.activeTab]}>
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>
      </View>

      {tab === 'Designs' ? (
        <DesignSection retOrder={retOrder} />
      ) : (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <Text style={styles.header}>My Orders</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View>
              {user && (
                <View style={styles.userDetails}>
                  <Text style={styles.sectionHeader}>User Details</Text>
                  <Text>Name: {user?.user?.name}</Text>
                  <Text>Email: {user?.user?.email}</Text>
                  <Text>Contact: {user?.user?.contact}</Text>
                  <Text>Address: {user?.user?.address}</Text>
                </View>
              )}

              {order ? (
                <View style={styles.orderDetails}>
                 
                  <View style={styles.textContainer}>
                    <Text style={styles.sectionHeader}>Order Details</Text>
                    <Text>Design: {order.item?.name}</Text>
                    <Text>Price: {order.item?.price}</Text>
                    {!isOrderCreated ? (
                      <TouchableOpacity style={styles.customButton} onPress={handleCreateOrder}>
                        <Text style={styles.buttonText}>Create Order</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.successText}>Order successfully created!</Text>
                    )}
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: order?.item?.image }}
                      style={styles.image}
                    />
                  </View>
                </View>
              ) : (
                <Text> </Text>
              )}

              <View style={{ margin: 8 }}>
                <Text style={styles.header}>Your Orders</Text>
                {myOrder.length > 0 ? (
                  myOrder.map((item, index) => (
                    <View key={index} style={styles.myOrderItem}>
                      <Text style={styles.sectionHeader}>Order Details</Text>
                      <Text>Design: {item.design}</Text>
                      <Text>Price: {item.price}</Text>
                      <Text>Date: {new Date(item?.createdAt).toLocaleString()}</Text>
                    </View>
                  ))
                ) : (
                  <Text>No order history found.</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 8,
    paddingLeft: 16,
  },
  userDetails: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  orderDetails: {
    flexDirection: 'row', // Align image and text horizontally
    alignItems: 'center', // Center vertically
    padding: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    borderRadius: 8,
    margin: 8,
    elevation: 4,
  },
  imageContainer: {
    flex: 1,
    marginLeft:25,
    alignItems: 'flex-end', // Align the image to the right side
  },
  textContainer: {
    flex: 2,
  },
  sectionHeader: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  image: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    borderRadius: 8,
  },
  successText: {
    color: 'green',
    marginTop: 8,
  },
  myOrderItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E90FF',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyOrders;
