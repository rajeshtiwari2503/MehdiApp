import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, ScrollView, RefreshControl, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request';
import DesignSection from './Designs';
import { Modal } from 'react-native';
 
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';




const MyOrders = ({ route }) => {
  const [tab, setTab] = useState('Designs');
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [myOrder, setMyOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


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
      const filData = userD?.user?.role === "AGENT" ? data?.filter((f) => f?.agentId === userD?.user?._id) : data?.filter((f) => f?.customerId === userD?.user?._id);

      setMyOrder(filData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching designs:", error);
    }
  };

   


  const handleCreateOrder = async () => {
    try {
      if (!order || !user) {
        Alert.alert('Error', 'Order or user details are missing.');
        return;
      }
  
      const orderData = {
        name: user?.user?.name,
        customerId: user?.user?._id,
        email: user?.user?.email,
        contact: user?.user?.contact,
        address: user?.user?.address,
        agentName: 'Agent Name Here',
        agentId: 'Agent ID Here',
        design: order?.item?.name,
        designId: order?.item?._id,
        image: order?.item?.image,
        price: order?.item?.price,
      };
  
      const amount = (order?.item?.groupOrder === true ? 500 : 50) * 100; // Convert to paise
      const resDatapay = { ...orderData, amount, currency: 'INR' };
  
      // Backend call to create the order
      const response = await http_request.post('/addOrder', resDatapay);
      const { data } = response;
  
      console.log('Backend response data:', data);
  
      if (!data?.razorpayOrderId) {
        Alert.alert('Error', 'Invalid Razorpay Order ID.');
        return;
      }
  
      const options = {
        key: 'rzp_test_RZvXA4bkG4UQnJ',
        amount: amount,
        currency: 'INR',
        name: 'S MEHNDI',
        description: 'Payment for order',
        order_id: data.razorpayOrderId,
        prefill: {
          name: user?.user?.name || 'Default Name',
          email: user?.user?.email || 'default@example.com',
          contact: user?.user?.contact || '9999999999',
        },
        theme: { color: '#3399cc' },
      };
  
      console.log('Razorpay options:', options);
  
      RazorpayCheckout.open(options)
        .then(async (orderDetails) => {
          console.log('Payment successful:', orderDetails);
  
          const refOrder = {
            razorpayPaymentId: orderDetails.razorpay_payment_id,
            razorpayOrderId: orderDetails.razorpay_order_id,
            razorpaySignature: orderDetails.razorpay_signature,
          };
  
          const verifyResponse = await axios.post(
            'https://mehdiappbackend.onrender.com/verify-payment',
            refOrder
          );
  
          // Add success alert or further processing here
        })
        .catch((error) => {
          console.error('Razorpay Error:', error);
          Alert.alert('Error', `Payment failed: ${error.description || error.code}`);
        });
    } catch (err) {
      console.error('Error in handleCreateOrder:', err);
      Alert.alert('Error', 'An error occurred while creating the order.');
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
  // console.log(user);
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  return (
    <>

      {
        user?.user?.role === "AGENT" ?
          <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            <View style={{ margin: 8 }}>
              <Text style={styles.header}>Your Orders</Text>
              {myOrder.length > 0 ? (
                myOrder.map((item, index) => (
                  <TouchableOpacity key={item._id || index} onPress={() => handleOrderClick(item)}>
                    <View style={styles.orderDetails} >
                      <View style={styles.textContainer}>
                        <Text style={styles.sectionHeader}>Order Details</Text>
                        <Text>Design: {item.design}</Text>
                        <Text>Price: {item.status}</Text>
                        <Text>Price: {item.price}</Text>

                        <Text>Date: {new Date(item?.createdAt).toLocaleString()}</Text>
                      </View>
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: item?.image }}
                          style={styles.image}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))

              ) : (
                <Text>No order history found.</Text>
              )}
            </View>
          </ScrollView>
          :
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
                          <TouchableOpacity
                            style={[
                              styles.customButton,
                              loading && { backgroundColor: 'gray' }, // Disable style
                            ]}
                            onPress={()=>handleCreateOrder()}
                            disabled={loading} // Disable button during loading
                          >
                            {loading ? (
                              <ActivityIndicator color="#fff" /> // Show spinner
                            ) : (
                              <Text style={styles.buttonText}>Create Order</Text>
                            )}
                          </TouchableOpacity>

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
                          <TouchableOpacity key={item._id || index} onPress={() => handleOrderClick(item)}>
                            <View style={styles.orderDetails} >
                              <View style={styles.textContainer}>
                                <Text style={styles.sectionHeader}>Order Details</Text>
                                <Text>Design: {item.design}</Text>
                                <Text>Price: {item.status}</Text>
                                <Text>Price: {item.price}</Text>
                                <Text>Date: {new Date(item?.createdAt).toLocaleString()}</Text>
                              </View>
                              <View style={styles.imageContainer}>
                                <Image
                                  source={{ uri: item?.image }}
                                  style={styles.image}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
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
      }
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Order Details</Text>
              {selectedOrder && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{selectedOrder.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{selectedOrder.email}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Contact:</Text>
                    <Text style={styles.value}>{selectedOrder.contact}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{selectedOrder.address}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Design:</Text>
                    <Text style={styles.value}>{selectedOrder.design}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Price:</Text>
                    <Text style={styles.value}>{selectedOrder.price}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Order Status:</Text>
                    <Text style={styles.value}>{selectedOrder.order}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Group Order:</Text>
                    <Text style={styles.value}>{selectedOrder.groupOrder === true ? "YES" : "NO"}</Text>
                  </View>
                  {selectedOrder.groupOrder === true ?
                    <>
                      <View style={styles.row}>
                        <Text style={styles.label}>Number Of People:</Text>
                        <Text style={styles.value}>{selectedOrder.noOfPeople}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Selected Date:</Text>
                        <Text style={styles.value}>{new Date(selectedOrder.selectedDate).toLocaleDateString()}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Selected Time:</Text>
                        <Text style={styles.value}>{new Date(selectedOrder.selectedTime).toLocaleTimeString()}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Bridal Mehndi:</Text>
                        <Text style={styles.value}>{selectedOrder.bridalMehndi}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.label}>Alternate contact:</Text>
                        <Text style={styles.value}>{selectedOrder.alternateNumber}</Text>
                      </View>
                      <Image
                        source={{ uri: selectedOrder.image }}
                        style={styles.modalImage}
                      />
                    </>
                    : ""
                  }
                  <View style={styles.row}>
                    <Text style={styles.label}>Created At:</Text>
                    <Text style={styles.value}>{new Date(selectedOrder.createdAt).toLocaleString()}</Text>
                  </View>

                </>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


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
    marginLeft: 25,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Adjusts the width
  },
  value: {
    fontSize: 15,
    color: '#555',
    flex: 2, // Adjusts the width
    textAlign: 'right', // Aligns the text to the right
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 16,
    alignSelf: 'center',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});

export default MyOrders;
