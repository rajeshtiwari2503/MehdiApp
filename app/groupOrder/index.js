import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../../http_request';

const GroupOrderDesign = ({ designsData }) => {
  const [designs, setDesigns] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState('5');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      // Replace with your actual HTTP request to fetch designs
      const response = await http_request.get('/getAllMehndiDesign'); // Replace with your endpoint
      const {data} =   response;
      const filteredDesigns = data?.filter((design) => design.groupOrder === true);
      setDesigns(filteredDesigns);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (design) => {
    setSelectedDesign(design);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDesign(null);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleOrder = async () => {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      Alert.alert('Login Required', 'Please log in to place an order.', [
        { text: 'Login', onPress: () => console.log('Navigate to Login') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    const orderData = {
      design: selectedDesign,
      date: selectedDate,
      people: numberOfPeople,
      user: JSON.parse(user),
    };

    // Save order to AsyncStorage or send it to the backend
    console.log('Order Placed:', orderData);
    Alert.alert('Order Confirmed', 'Your order has been placed successfully.');
    closeModal();
  };
  const items = [
    { name: 'Simple Bunch', price: '150 Rs.' },
    { name: 'Heavey Mandala', price: '200-250 Rs.' },
    { name: 'Simple party Mehndi', price: '200 Rs.' },
    { name: 'Heavey party Mehndi', price: '200-400 Rs.' },
    { name: 'Simple Feet Mehndi', price: '200 Rs.' },
    { name: 'Party Feet Mehndi', price: '250-500 Rs.' },
    { name: 'Bridal Mehndi', price: '1500-4000 Rs.' },
    { name: 'Bridal Feet Mehndi', price: '1000-2000 Rs.' },
    { name: 'Complete Bridle', price: '2500-7000 Rs.' },


  ];
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Group Order</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
       {showMenu===false? 
       <ScrollView contentContainerStyle={styles.grid}>
          {designs.map((design, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => setShowMenu(true)}
            >
              <ImageBackground
                source={{ uri: design.image }}
                resizeMode="cover"
                style={styles.imageBackground}
              >
                <View style={styles.overlay}>
                  <Text style={styles.cardTitle}>{design.name}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
        : <ScrollView contentContainerStyle={styles.grid}>
          <View style={styles.card}>
          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
            <TouchableOpacity style={styles.button} onPress={() => openModal( )}>
            <Text style={styles.buttonText}>Proceed to Order</Text>
          </TouchableOpacity>
        </View>
         </ScrollView>
       }
       </>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDesign?.name || 'Order Details'}
            </Text>
            <Text style={styles.label}>Number of People</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={numberOfPeople}
                onValueChange={(value) => setNumberOfPeople(value)}
                style={styles.picker}
              >
                {[...Array(16).keys()].map((i) => (
                  <Picker.Item
                    key={i}
                    label={(i + 5).toString()}
                    value={(i + 5).toString()}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {selectedDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.modalButtons}>
              <Button title="Place Order" onPress={handleOrder} />
              <Button title="Cancel" color="red" onPress={closeModal} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#c4650c',
    paddingBottom: 5,
    paddingTop: 5,
    padding:10
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%', // Width of the card is 90% of the screen width
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'flex-start', // Left align the content inside the card
  },
  item: {
    flexDirection: 'row', // Makes the name and price inline
    justifyContent: 'space-between', // Space between the name and price
    marginBottom: 12, // Space between each item
    width: '100%', // Space between each item
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    marginTop: 20,  // Adds space above the button
    backgroundColor: '#ff7f50', // Button background color
    paddingVertical: 12,  // Vertical padding for the button
    paddingHorizontal: 40,  // Horizontal padding
    borderRadius: 8,  // Rounded corners for the button
    alignItems: 'center',  // Centers the button text
    width: '100%',  // Make the button take full width of the card
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GroupOrderDesign;
