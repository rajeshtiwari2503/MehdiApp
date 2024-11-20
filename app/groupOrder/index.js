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
  TextInput,
  Image,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../../http_request';
import { Checkbox } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from 'expo-router';
import axios from 'axios';

const GroupOrderDesign = ({ designsData }) => {
  const [order, setOrder] = useState("null");
  const [user, setUser] = useState(null);
  const [designs, setDesigns] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numberOfPeople: '5',
      selectedDate: new Date(),
      selectedTime: new Date(),
      
      alternateNo: '',
      bridalMehndi: false,
    },
  });

  useEffect(() => {
    const retrieveData = async () => {
      const storedOrder = await AsyncStorage.getItem('orderM');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedOrder){
        const orderData = JSON.parse(storedOrder);     
        setOrder(orderData);
        setValue('design', orderData?.name || '');
        setValue('price', orderData?.price || '');
        setValue('designId', orderData?._id || '');
        setValue('groupOrder', orderData?.groupOrder || '');
        setValue('image', orderData?.image || '');

      } 
      if (storedUser){
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setValue('name', userData?.user?.name || '');
        setValue('customerId', userData?.user?._id || '');
        setValue('contact', userData?.user?.contact || '');
        setValue('address', userData?.user?.address || '');
      }
          
    };
    fetchDesigns();
    retrieveData();
  }, [showMenu ]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await http_request.get('/getAllMehndiDesign');
      const { data } = response;
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
    reset();
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setValue('selectedDate', date);
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      const updatedTime = new Date(getValues('selectedDate'));
      updatedTime.setHours(time.getHours());
      updatedTime.setMinutes(time.getMinutes());
      setValue('selectedTime', updatedTime);
    }
  };


  const handleGroup = (design) => {
    // console.log(design);

    AsyncStorage.setItem("orderM", JSON.stringify(design));
    // setOrder(design)
    setShowMenu(true)
  }


const navigation=useNavigation()
  const onSubmit = async (data1) => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        Alert.alert('Login Required', 'Please log in to place an order.', [
          { text: 'Login', onPress: () => console.log('Navigate to Login') },
          { text: 'Cancel', style: 'cancel' },
        ]);
        return;
      }
  
      
  
      // Prepare order data
      const orderData = {
        ...data1, // Form data
       
      };
  
      setLoading(true);
  
      // Send order dat 
      const response = await http_request.post('/addOrder', orderData);
      const { data } = response;
      AsyncStorage.removeItem('orderM');
      navigation.navigate("Order")
      setLoading(false);
      Alert.alert('Order Confirmed', 'Your order has been placed successfully.');
      closeModal();
  
    
    } catch (error) {
      setLoading(false);
      console.error('Error placing order:', error);
  
      // Inform user of the error
      Alert.alert(
        'Order Failed',
        'There was an issue placing your order. Please try again later.'
      );
    }
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
          {!showMenu ? (
            <ScrollView contentContainerStyle={styles.grid}>
              {designs.map((design, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => handleGroup(design)}
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
          ) : (
            <ScrollView contentContainerStyle={styles.grid}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/Logo.png')}
                  style={styles.logo}
                />
              </View>
              <View style={styles.card}>
                {items.map((item, index) => (
                  <View key={index} style={styles.item}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.button} onPress={() => openModal()}>
                  <Text style={styles.buttonText}>Proceed to Order</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
        {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDesign?.name || 'Order Details'}</Text>

            <Text style={styles.label}>Number of People</Text>
            <Controller
              control={control}
              name="numberOfPeople"
              render={({ field: { value, onChange } }) => (
                <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                  {[...Array(96).keys()].map((i) => (
                    <Picker.Item key={i} label={(i + 5).toString()} value={(i + 5).toString()} />
                  ))}
                </Picker>
              )}
            />

            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{getValues('selectedDate').toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={getValues('selectedDate')}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.label}>Select Time</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{getValues('selectedTime').toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={getValues('selectedTime')}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <Text style={styles.label}>Address</Text>
            <Controller
              control={control}
              name="address"
              rules={{ required: 'Address is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.address && { borderColor: 'red' }]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your address"
                  multiline
                />
              )}
            />
            {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}

            <Text style={styles.label}>Contact Number</Text>
            <Controller
              control={control}
              name="contact"
              rules={{ required: 'Contact number is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.contact && { borderColor: 'red' }]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your contact number"
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.contact && <Text style={styles.error}>{errors.contact.message}</Text>}
            <Text style={styles.label}>Alternate Contact Number</Text>
            <Controller
              control={control}
              name="alternateNo"
              rules={{
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit contact number',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.alternateNo && { borderColor: 'red' }]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter alternate contact number"
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.alternateNo && <Text style={styles.error}>{errors.alternateNo.message}</Text>}

            <View style={styles.checkboxContainer}>
              <Controller
                control={control}
                name="bridalMehndi"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    status={value ? 'checked' : 'unchecked'}
                    onPress={() => onChange(!value)}
                  />
                )}
              />
              <Text style={styles.checkboxLabel}>Bridal Mehndi</Text>
            </View>

            <View style={styles.modalButtons}>
              <Button title="Place Order" onPress={handleSubmit(onSubmit)} />
              <Button title="Cancel" color="red" onPress={closeModal} />
            </View>
          </View>
      )
    }
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
    padding: 10
  },
  logoContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // elevation: 5,
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    marginBottom: 10,
  },
  logo: {
    width: '40%', // Take full width of parent container
    height: 70, // Set height as per your requirement
    borderRadius: 4, // Apply border radius
    resizeMode: "cover",
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
    marginVertical: 5,
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default GroupOrderDesign;
