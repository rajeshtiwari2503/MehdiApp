import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity,  StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from "../http_request";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import * as FileSystem from 'expo-file-system';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import * as Location from 'expo-location';

const CreateComplaint = ({ isVisible, onClose, RefreshData }) => {
    const { control, handleSubmit, formState: { errors }, getValues, reset, setValue } = useForm();
    const [image, setImage] = useState(null);
    // const [issueImages, setIssueImages] = useState([]);
    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [productName, setProductName] = useState("")
    const [value, setLocalValue] = useState('');

    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);
    const [locationCurrent, setLocationCurrent] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const getAllProducts = async () => {
        try {
            const storedValue = await AsyncStorage.getItem("user");
            if (storedValue) {
                setUserData(JSON.parse(storedValue));
                setLocalValue(JSON.parse(storedValue))
            }
            let response = await http_request.get("/getAllProduct");
            let { data } = response;
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const registerComplaint = async (reqData) => {
        try {
            if (location) {
                // console.log(location,"dhghg");
                
            setLoading(true);
            const formData = new FormData();
            for (const key in reqData) {
                if (reqData.hasOwnProperty(key)) {
                    formData.append(key, reqData[key]);
                }
            }
            // if (image) {
            //     console.log("dghhghgghg",image);
                
            //     formData.append('issueImages', {
            //         uri: image,
            //         type: 'image/jpeg',
            //         name: 'image.jpg',
            //     });
            // }
            // if (image) {
            //       const fileUri = image.replace('file://', '');
            //       console.log(fileUri);
                  
            //        formData.append('issueImages', {
            //           uri: fileUri,
            //           type: 'image/jpeg',
            //           name: 'image.jpg',
            //      });
            //      }
            // formData.append('issueImages',image )
            // const fileUri = image.replace('file://', '');
            // const fileInfo = await FileSystem.getInfoAsync(image);
            // const { size, mimeType } = fileInfo;
            
            // console.log(fileInfo);
            
            // formData.append('issueImages', {
            //   uri:   image.replace('file://', '')  ,
            //   name: 'photo.jpg',  
            //   type: mimeType || 'image/jpeg', 
            // });
            console.log(reqData);
            
            let response = await http_request.post('/createAppComplaint', reqData
               
            );
               
         
            const { data } = response;
            // console.log("Complaint created:", data);
            RefreshData(data)
            setLoading(false);
            Toast.show({ type: 'success', text1: data.msg });
            onClose();
            reset();
        }
            else {
                // setError('Please enter a valid pincode.');
                return;
        
              }
        } catch (error) {
            setLoading(false);
            Toast.show({ type: 'success', text1:  "Internal Server Error." });
            if (error.response) {
              // Server responded with a status other than 2xx
              console.error('Server Error:', error.response.data);
            } else if (error.request) {
              // No response was received
              console.error('No Response:', error );
            } else {
              // Error setting up the request
              console.error('Request Error:', error );
            }
          }
    };

    const onSubmit = async (data) => {
        try {
        //    console.log(pincode);
           
          if (pincode) {
            const locationResponse = await fetchLocation();  
      
            if (!locationResponse) {
              setError('Failed to fetch location details.');
              return;
            }
      
          
            await registerComplaint(data);
      
          } else {
            setError('Please enter a pincode.');
          }
        } catch (error) {
          // Handle unexpected errors
          setError('An error occurred while submitting the complaint. Please try again.');
          console.error(error);
        }
      };

      const fetchLocation = async () => {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        //   console.log("response",response.data[0].Status);
          
          if (response.data && response.data[0].Status === 'Success') {
             
              const [details] = response.data;
              const { District, State } = details.PostOffice[0];
              console.log("response",District,State);
              setLocation({ District, State });
              setValue('pincode', pincode);
              setValue('state', State);
              setValue('district', District);
            return response.data[0].PostOffice[0]; // Return the location details
          } else {
            setError('No location found for the provided pincode.');
            return  ;
          }
        } catch (error) {
          setError('Error fetching location details.');
          console.error(error);
          return  ;
        }
      };
    const handleProductChange = (selectedProductId) => {
        const selectedProduct = products.find(product => product._id === selectedProductId);
        setProductName("selectedProduct")
        if (selectedProduct) {
            setValue('productName', selectedProduct.productName);
            setValue('categoryName', selectedProduct.categoryName);
            setValue('productBrand', selectedProduct.productBrand);
            setValue('productId', selectedProduct._id);
            setValue('categoryId', selectedProduct.categoryId);
            setValue('brandId', selectedProduct.brandId);
            setValue('modelNo', selectedProduct.modelNo);
            setValue('serialNo', selectedProduct.serialNo);
            setValue('purchaseDate', selectedProduct.purchaseDate);
            setValue('warrantyStatus', selectedProduct.warrantyStatus);
            setValue('warrantyYears', selectedProduct.warrantyYears);
            setValue('userId', value?.user?._id)
            setValue('userName', value?.user?.name);
            setValue('fullName', value?.user?.name);
            setValue('phoneNumber', value?.user?.contact);
            setValue('emailAddress', value?.user?.email);
            setValue('serviceAddress', value?.user?.address);
        }
    };

   

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let locationCurr = await Location.getCurrentPositionAsync({});
          setLocationCurrent(locationCurr);
          setValue("lat",locationCurr?.coords?.latitude)
          setValue("long",locationCurr?.coords?.longitude)
        })();
        getAllProducts()
      }, []);
    
      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (locationCurrent) {
        text = `Latitude: ${locationCurrent.coords.latitude}, Longitude: ${locationCurrent.coords.longitude}`;
      }
    // console.log("chghgg",locationCurrent);
    
    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
          type: ['image/*'], // You can specify other types here
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const { uri } = result.assets[0];
          console.log('Picked document URI:', uri);
    
          setImage(uri);
         
        } else {
          console.log('Document picking was canceled');
        }
      };
      

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setValue("preferredServiceDate", currentDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        const currentTime = selectedTime || time;
        setTime(currentTime);
        setValue("preferredServiceTime", `${currentTime.getHours()}:${currentTime.getMinutes()}`); // Format HH:mm
    };


    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1 }}>
                    Create a new complaint
                </Text>
                <TouchableOpacity onPress={onClose}>
                    <MaterialIcons name="cancel" size={40} color="red" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.containerScroll}>

{/* 
                 <Text style={styles.label}>Product Name</Text>
                <Controller
                    control={control}
                    name="productName"
                    rules={{ required: 'Product is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.productName && styles.errorBorder]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.productName && <Text style={styles.errorText}>{errors.productName.message}</Text>}   */}

                <Text style={styles.label}>Select Product</Text>
                <Controller
                    control={control}
                    name="productName"
                    render={({ field: { onChange, value } }) => (
                        <Picker
                            selectedValue={products.find(product => product._id === getValues('productId'))?._id || ''}
                            onValueChange={(itemValue) => handleProductChange(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a product" value="" />
                            {products.map(product => (
                                <Picker.Item key={product?._id} label={product.productName} value={product._id} />
                            ))}
                        </Picker>
                    )}
                />
                {errors.productName && <Text style={styles.errorText}>{errors.productName.message}</Text>}

                <Text style={styles.label}>Product Category</Text>
                <Controller
                    control={control}
                    name="categoryName"
                    rules={{ required: 'Category is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.categoryName && styles.errorBorder]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.categoryName && <Text style={styles.errorText}>{errors.categoryName.message}</Text>}

                {/* <Text style={styles.label}>Select Category</Text>
            <Controller
                control={control}
                name="selectedCategory"
                render={({ field: { onChange, value } }) => (
                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                        style={[styles.picker, errors.selectedCategory && styles.errorBorder]}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {products.map(product => (
                            <Picker.Item key={product._id} label={product.productName} value={product.productId} />
                        ))}
                    </Picker>
                )}
            />
            {errors.selectedCategory && <Text style={styles.errorText}>{errors.selectedCategory.message}</Text>} */}

                <Text style={styles.label}>Brand</Text>
                <Controller
                    control={control}
                    name="productBrand"
                    rules={{ required: 'Product Brand is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.productBrand && styles.errorBorder]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.productBrand && <Text style={styles.errorText}>{errors.productBrand.message}</Text>}

                {/* <Text style={styles.label}>Select Brand</Text>
            <Controller
                control={control}
                name="selectedBrand"
                render={({ field: { onChange, value } }) => (
                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                        style={[styles.picker, errors.selectedBrand && styles.errorBorder]}
                    >
                        <Picker.Item label="Select a Brand" value="" />
                        {products.map(product => (
                            <Picker.Item key={product.productId} label={product.productName} value={product.productId} />
                        ))}
                    </Picker>
                )}
            />
            {errors.selectedBrand && <Text style={styles.errorText}>{errors.selectedBrand.message}</Text>} */}


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Model Number</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Model Number is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.modelNo && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="modelNo"
                        defaultValue=""
                    />
                    {errors.modelNo && <Text style={styles.errorText}>{errors.modelNo.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Serial Number</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Serial Number is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.serialNumber && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="serialNo"
                        defaultValue=""
                    />
                    {errors.serialNo && <Text style={styles.errorText}>{errors.serialNo.message}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Purchase Date</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Purchase Date is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.serialNumber && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="purchaseDate"
                        defaultValue=""
                    />
                    {errors.purchaseDate && <Text style={styles.errorText}>{errors.purchaseDate.message}</Text>}
                </View>
                {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Purchase Date</Text>
                <Button onPress={() => setShowDatePicker(true)} title="Select Purchase Date" />
                {showDatePicker && (
                    <DateTimePicker
                        value={purchaseDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View> */}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Issue Type</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Issue Type is required' }}
                        render={({ field: { onChange, value } }) => (
                            <Picker
                                selectedValue={value}
                                onValueChange={onChange}
                                style={styles.input}
                            >
                                <Picker.Item label="Select an issue type" value="" />
                                <Picker.Item label="Hardware" value="Hardware" />
                                <Picker.Item label="Software" value="Software" />
                                <Picker.Item label="Performance" value="Performance" />
                                <Picker.Item label="Physical Damage" value="Physical Damage" />
                            </Picker>
                        )}
                        name="issueType"
                        defaultValue=""
                    />
                    {errors.issueType && <Text style={styles.errorText}>{errors.issueType.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Detailed Description</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Detailed Description is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.detailedDescription && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                                multiline
                            />
                        )}
                        name="detailedDescription"
                        defaultValue=""
                    />
                    {errors.detailedDescription && <Text style={styles.errorText}>{errors.detailedDescription.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Issue Images</Text>
                    <Button title="Pick a document" onPress={pickDocument} />
                    <ScrollView contentContainerStyle={styles.imagesContainer}>
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

                    </ScrollView>
                </View>

                <Controller
                    control={control}
                    name="preferredServiceDate"
                    rules={{ required: 'Preferred Service Date is required' }}
                    render={({ field: { value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Preferred Service Date</Text>
                            <TextInput
                                style={[styles.input, errors.preferredServiceDate && styles.errorInput]}
                                value={value}
                                placeholder="YYYY-MM-DD"
                                onTouchStart={() => setShowDatePicker(true)}
                            // editable={false}
                            />
                            {errors.preferredServiceDate && <Text style={styles.errorText}>{errors.preferredServiceDate.message}</Text>}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="preferredServiceTime"
                    rules={{ required: 'Preferred Service Time is required' }}
                    render={({ field: { value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Preferred Service Time</Text>
                            <TextInput
                                style={[styles.input, errors.preferredServiceTime && styles.errorInput]}
                                value={value}
                                placeholder="HH:mm"
                                onTouchStart={() => setShowTimePicker(true)}
                            // editable={false}
                            />
                            {errors.preferredServiceTime && <Text style={styles.errorText}>{errors.preferredServiceTime.message}</Text>}
                            {showTimePicker && (
                                <DateTimePicker
                                    value={time}
                                    mode="time"
                                    display="default"
                                    onChange={onTimeChange}
                                />
                            )}
                        </View>
                    )}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Service Location</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Service Location is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.serviceLocation && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="serviceLocation"
                        defaultValue=""
                    />
                    {errors.serviceLocation && <Text style={styles.errorText}>{errors.serviceLocation.message}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pincode</Text>
                    <Controller
                        control={control}
                        name="pincode"
                        rules={{ required: 'Pincode is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.pincode && styles.errorInput]}
                                onChangeText={text => {
                                    setPincode(text);
                                    onChange(text);
                                }}
                                value={value}
                            />
                        )}
                    />
                    {errors.pincode && <Text style={styles.errorText}>{errors.pincode.message}</Text>}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Full Name is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.fullName && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="fullName"
                        defaultValue=""
                    />
                    {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Phone Number is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.phoneNumber && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="phone-pad"
                            />
                        )}
                        name="phoneNumber"
                        defaultValue=""
                    />
                    {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <Controller
                        control={control}
                        rules={{
                            required: 'Email Address is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: 'Invalid email address',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.emailAddress && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                            />
                        )}
                        name="emailAddress"
                        defaultValue=""
                    />
                    {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Service Address</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Service Address is required' }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[styles.input, errors.serviceAddress && styles.errorInput]}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="serviceAddress"
                        defaultValue=""
                    />
                    {errors.serviceAddress && <Text style={styles.errorText}>{errors.serviceAddress.message}</Text>}
                </View>
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    disabled={loading}
                    onPress={handleSubmit(onSubmit)}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Create Request</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    </Modal>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,

},
imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
},
image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
    resizeMode: 'cover', // Ensure the image is scaled correctly
},
saveButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
},
saveButtonText: {
    color: '#fff',
    fontSize: 16,
},
inputContainer: {
    marginBottom: 16,
},
label: {
    marginBottom: 8,
    fontWeight: 'bold',
},
input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
},
errorInput: {
    borderColor: 'red',
},
errorText: {
    color: 'red',
    marginTop: 4,
},
imageUri: {
    marginTop: 8,
    color: '#555',
},
});
                    
                    
export default CreateComplaint;



// key_id,key_secret
// rzp_live_TUCguxqFNXe2aa,kKbvP9c4BWT5mtGlyGIBhynE

// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { useForm, Controller } from 'react-hook-form';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as DocumentPicker from 'expo-document-picker';
// import { Picker } from '@react-native-picker/picker';
// import Modal from 'react-native-modal';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import http_request from "../http_request"
// import { MaterialIcons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors'

// const CreateComplaint = ({ isVisible, onClose, RefreshData }) => {
//     const { control, handleSubmit, formState: { errors }, getValues,reset, setValue } = useForm();
//     const [image, setImage] = useState(null);
    
//     const [issueImages, setIssueImages] = useState([]);
//     const [products, setProducts] = useState([])
//     const [value, setLocalValue] = useState('');
//     const [productName, setProductName] = useState("")
//     const [loading, setLoading] = useState(false);

//     const getAllProducts = async () => {
//         try {
//             const storedValue = await AsyncStorage.getItem("user");
//             if (storedValue) {
//                 const userData = JSON.parse(storedValue);

//                 setLocalValue(userData);
//             }
//             let response = await http_request.get("/getAllProduct")
//             let { data } = response;

//             setProducts(data)
//         }

//         catch (err) {
//             console.log(err);
//         }
//     }
//     const RegiterComplaint = async (reqData) => {
       
    
//         try {
//             setLoading(true)
             
//             const formData = new FormData();
//             for (const key in reqData) {
//                 if (reqData.hasOwnProperty(key)) {
//                     formData.append(key, reqData[key]);
//                 }
//             }
//             // if (image) {
//             //     const fileUri = image.replace('file://', '');
//             //     formData.append('issueImages', {
//             //         uri: fileUri,
//             //         type: 'image/jpeg',
//             //         name: 'image.jpg',
//             //     });
//             // }
//             formData.forEach((value, key) => {
//                 console.log(`${key}: ${value}`);
//             });
            
//             let response = await http_request.post('/createComplaint', reqData)
//             const { data } = response
//             console.log(response);
//             // ToastMessage(data)
//             setLoading(false)
//             onClose()
//             reset()
//             // router.push("/complaint/allComplaint")
//         }
//         catch (err) {
//             setLoading(false)
//             console.log("gsfgfg",err.response.data || err);
           
//             console.log(err);
//         }

//     }

//     const onSubmit = (data) => {
//         // console.log(data);
//         RegiterComplaint(data)
//     };


//     const handleProductChange = (selectedProductId) => {
//         const selectedProduct = products.find(product => product._id === selectedProductId);
//         setProductName("selectedProduct")
//         if (selectedProduct) {
//             setValue('productName', selectedProduct.productName);
//             setValue('categoryName', selectedProduct.categoryName);
//             setValue('productBrand', selectedProduct.productBrand);
//             setValue('productId', selectedProduct._id);
//             setValue('categoryId', selectedProduct.categoryId);
//             setValue('brandId', selectedProduct.brandId);
//             setValue('modelNo', selectedProduct.modelNo);
//             setValue('serialNo', selectedProduct.serialNo);
//             setValue('purchaseDate', selectedProduct.purchaseDate);
//             setValue('warrantyStatus', selectedProduct.warrantyStatus);
//             setValue('warrantyYears', selectedProduct.warrantyYears);
//         }
//     };

//     useEffect(() => {


//         if (productName) {
//             setValue('fullName', value.user.name);
//             setValue('phoneNumber', value.user.contact);
//             setValue('emailAddress', value.user.email);
//             setValue('serviceAddress', value.user.address);
//         }
//         getAllProducts()

//     }, [productName])

    
//     const selectImages = async () => {
//         try {
//             let result = await DocumentPicker.getDocumentAsync({ type: ['image/*'] });
//             if (!result.canceled && result.assets.length > 0) {
//                 setImage(result.assets[0].uri);
//                 setIssueImages(prevImages => [...prevImages, result.assets[0].uri]);
//             }
//         } catch (error) {
//             console.error('Error selecting images:', error);
//         }
//     };

//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const [showTimePicker, setShowTimePicker] = useState(false);
//     const [date, setDate] = useState(new Date());
//     const [time, setTime] = useState(new Date());

//     const onDateChange = (event, selectedDate) => {
//         setShowDatePicker(false);
//         const currentDate = selectedDate || date;
//         setDate(currentDate);
//         setValue("preferredServiceDate", currentDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
//     };

//     const onTimeChange = (event, selectedTime) => {
//         setShowTimePicker(false);
//         const currentTime = selectedTime || time;
//         setTime(currentTime);
//         setValue("preferredServiceTime", `${currentTime.getHours()}:${currentTime.getMinutes()}`); // Format HH:mm
//     };



//     return (
//         <Modal isVisible={isVisible} onBackdropPress={onClose}>
//             <View style={styles.container}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', }}>
//                     <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1 }}>
//                         Create a new complaint
//                     </Text>
//                     <TouchableOpacity onPress={onClose}>
//                         <MaterialIcons name="cancel" size={40} color="red" />
//                     </TouchableOpacity>
//                 </View>
//                 <ScrollView contentContainerStyle={styles.containerScroll}>


//                     <Text style={styles.label}>Product Name</Text>
//                     <Controller
//                         control={control}
//                         name="productName"
//                         rules={{ required: 'Product is required' }}
//                         render={({ field: { onChange, onBlur, value } }) => (
//                             <TextInput
//                                 style={[styles.input, errors.productName && styles.errorBorder]}
//                                 onBlur={onBlur}
//                                 onChangeText={onChange}
//                                 value={value}
//                             />
//                         )}
//                     />
//                     {errors.productName && <Text style={styles.errorText}>{errors.productName.message}</Text>}

//                     <Text style={styles.label}>Select Product</Text>
//                     <Controller
//                         control={control}
//                         name="productName"
//                         render={({ field: { onChange, value } }) => (
//                             <Picker
//                                 selectedValue={products.find(product => product._id === getValues('productId'))?._id || ''}
//                                 onValueChange={(itemValue) => handleProductChange(itemValue)}
//                                 style={styles.picker}
//                             >
//                                 <Picker.Item label="Select a product" value="" />
//                                 {products.map(product => (
//                                     <Picker.Item key={product?._id} label={product.productName} value={product._id} />
//                                 ))}
//                             </Picker>
//                         )}
//                     />
//                     {errors.productName && <Text style={styles.errorText}>{errors.productName.message}</Text>}

//                     <Text style={styles.label}>Product Category</Text>
//                     <Controller
//                         control={control}
//                         name="categoryName"
//                         rules={{ required: 'Category is required' }}
//                         render={({ field: { onChange, onBlur, value } }) => (
//                             <TextInput
//                                 style={[styles.input, errors.categoryName && styles.errorBorder]}
//                                 onBlur={onBlur}
//                                 onChangeText={onChange}
//                                 value={value}
//                             />
//                         )}
//                     />
//                     {errors.categoryName && <Text style={styles.errorText}>{errors.categoryName.message}</Text>}

//                     {/* <Text style={styles.label}>Select Category</Text>
//                 <Controller
//                     control={control}
//                     name="selectedCategory"
//                     render={({ field: { onChange, value } }) => (
//                         <Picker
//                             selectedValue={value}
//                             onValueChange={(itemValue) => onChange(itemValue)}
//                             style={[styles.picker, errors.selectedCategory && styles.errorBorder]}
//                         >
//                             <Picker.Item label="Select a category" value="" />
//                             {products.map(product => (
//                                 <Picker.Item key={product._id} label={product.productName} value={product.productId} />
//                             ))}
//                         </Picker>
//                     )}
//                 />
//                 {errors.selectedCategory && <Text style={styles.errorText}>{errors.selectedCategory.message}</Text>} */}

//                     <Text style={styles.label}>Brand</Text>
//                     <Controller
//                         control={control}
//                         name="productBrand"
//                         rules={{ required: 'Product Brand is required' }}
//                         render={({ field: { onChange, onBlur, value } }) => (
//                             <TextInput
//                                 style={[styles.input, errors.productBrand && styles.errorBorder]}
//                                 onBlur={onBlur}
//                                 onChangeText={onChange}
//                                 value={value}
//                             />
//                         )}
//                     />
//                     {errors.productBrand && <Text style={styles.errorText}>{errors.productBrand.message}</Text>}

//                     {/* <Text style={styles.label}>Select Brand</Text>
//                 <Controller
//                     control={control}
//                     name="selectedBrand"
//                     render={({ field: { onChange, value } }) => (
//                         <Picker
//                             selectedValue={value}
//                             onValueChange={(itemValue) => onChange(itemValue)}
//                             style={[styles.picker, errors.selectedBrand && styles.errorBorder]}
//                         >
//                             <Picker.Item label="Select a Brand" value="" />
//                             {products.map(product => (
//                                 <Picker.Item key={product.productId} label={product.productName} value={product.productId} />
//                             ))}
//                         </Picker>
//                     )}
//                 />
//                 {errors.selectedBrand && <Text style={styles.errorText}>{errors.selectedBrand.message}</Text>} */}


//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Model Number</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Model Number is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.modelNo && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                 />
//                             )}
//                             name="modelNo"
//                             defaultValue=""
//                         />
//                         {errors.modelNo && <Text style={styles.errorText}>{errors.modelNo.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Serial Number</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Serial Number is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.serialNumber && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                 />
//                             )}
//                             name="serialNo"
//                             defaultValue=""
//                         />
//                         {errors.serialNo && <Text style={styles.errorText}>{errors.serialNo.message}</Text>}
//                     </View>
//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Purchase Date</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Purchase Date is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.serialNumber && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                 />
//                             )}
//                             name="purchaseDate"
//                             defaultValue=""
//                         />
//                         {errors.purchaseDate && <Text style={styles.errorText}>{errors.purchaseDate.message}</Text>}
//                     </View>
//                     {/* <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Purchase Date</Text>
//                     <Button onPress={() => setShowDatePicker(true)} title="Select Purchase Date" />
//                     {showDatePicker && (
//                         <DateTimePicker
//                             value={purchaseDate}
//                             mode="date"
//                             display="default"
//                             onChange={handleDateChange}
//                         />
//                     )}
//                 </View> */}

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Issue Type</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Issue Type is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <Picker
//                                     selectedValue={value}
//                                     onValueChange={onChange}
//                                     style={styles.input}
//                                 >
//                                     <Picker.Item label="Select an issue type" value="" />
//                                     <Picker.Item label="Hardware" value="Hardware" />
//                                     <Picker.Item label="Software" value="Software" />
//                                     <Picker.Item label="Performance" value="Performance" />
//                                     <Picker.Item label="Physical Damage" value="Physical Damage" />
//                                 </Picker>
//                             )}
//                             name="issueType"
//                             defaultValue=""
//                         />
//                         {errors.issueType && <Text style={styles.errorText}>{errors.issueType.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Detailed Description</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Detailed Description is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.detailedDescription && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     multiline
//                                 />
//                             )}
//                             name="detailedDescription"
//                             defaultValue=""
//                         />
//                         {errors.detailedDescription && <Text style={styles.errorText}>{errors.detailedDescription.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Issue Images</Text>
//                         <Button onPress={selectImages} title="Select Images" />
//                         <ScrollView contentContainerStyle={styles.imagesContainer}>
//                             {issueImages.length > 0 && issueImages.map((uri, index) => (
//                                 <Image
//                                     key={index}
//                                     source={{ uri }}
//                                     style={styles.image}
//                                     // onLoad={() => console.log('Image loaded:', uri)}
//                                     // onError={(error) => console.error('Error loading image:', error)}
//                                 />
//                             ))}
//                         </ScrollView>
//                     </View>

//                     <Controller
//                         control={control}
//                         name="preferredServiceDate"
//                         rules={{ required: 'Preferred Service Date is required' }}
//                         render={({ field: { value } }) => (
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Preferred Service Date</Text>
//                                 <TextInput
//                                     style={[styles.input, errors.preferredServiceDate && styles.errorInput]}
//                                     value={value}
//                                     placeholder="YYYY-MM-DD"
//                                     onTouchStart={() => setShowDatePicker(true)}
//                                 // editable={false}
//                                 />
//                                 {errors.preferredServiceDate && <Text style={styles.errorText}>{errors.preferredServiceDate.message}</Text>}
//                                 {showDatePicker && (
//                                     <DateTimePicker
//                                         value={date}
//                                         mode="date"
//                                         display="default"
//                                         onChange={onDateChange}
//                                     />
//                                 )}
//                             </View>
//                         )}
//                     />

//                     <Controller
//                         control={control}
//                         name="preferredServiceTime"
//                         rules={{ required: 'Preferred Service Time is required' }}
//                         render={({ field: { value } }) => (
//                             <View style={styles.inputContainer}>
//                                 <Text style={styles.label}>Preferred Service Time</Text>
//                                 <TextInput
//                                     style={[styles.input, errors.preferredServiceTime && styles.errorInput]}
//                                     value={value}
//                                     placeholder="HH:mm"
//                                     onTouchStart={() => setShowTimePicker(true)}
//                                 // editable={false}
//                                 />
//                                 {errors.preferredServiceTime && <Text style={styles.errorText}>{errors.preferredServiceTime.message}</Text>}
//                                 {showTimePicker && (
//                                     <DateTimePicker
//                                         value={time}
//                                         mode="time"
//                                         display="default"
//                                         onChange={onTimeChange}
//                                     />
//                                 )}
//                             </View>
//                         )}
//                     />
//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Service Location</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Service Location is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.serviceLocation && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                 />
//                             )}
//                             name="serviceLocation"
//                             defaultValue=""
//                         />
//                         {errors.serviceLocation && <Text style={styles.errorText}>{errors.serviceLocation.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Full Name</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Full Name is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.fullName && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                 />
//                             )}
//                             name="fullName"
//                             defaultValue=""
//                         />
//                         {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Phone Number</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Phone Number is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.phoneNumber && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     keyboardType="phone-pad"
//                                 />
//                             )}
//                             name="phoneNumber"
//                             defaultValue=""
//                         />
//                         {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Email Address</Text>
//                         <Controller
//                             control={control}
//                             rules={{
//                                 required: 'Email Address is required',
//                                 pattern: {
//                                     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//                                     message: 'Invalid email address',
//                                 },
//                             }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.emailAddress && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                     keyboardType="email-address"
//                                 />
//                             )}
//                             name="emailAddress"
//                             defaultValue=""
//                         />
//                         {errors.emailAddress && <Text style={styles.errorText}>{errors.emailAddress.message}</Text>}
//                     </View>

//                     <View style={styles.inputContainer}>
//                         <Text style={styles.label}>Service Address</Text>
//                         <Controller
//                             control={control}
//                             rules={{ required: 'Service Address is required' }}
//                             render={({ field: { onChange, value } }) => (
//                                 <TextInput
//                                     style={[styles.input, errors.serviceAddress && styles.errorInput]}
//                                     onChangeText={onChange}
//                                     value={value}
//                                 />
//                             )}
//                             name="serviceAddress"
//                             defaultValue=""
//                         />
//                         {errors.serviceAddress && <Text style={styles.errorText}>{errors.serviceAddress.message}</Text>}
//                     </View>
//                     <TouchableOpacity
//                         style={[styles.saveButton, loading && styles.saveButtonDisabled]}
//                         disabled={loading}
//                         onPress={handleSubmit(onSubmit)}
//                     >
//                         {loading ? (
//                             <ActivityIndicator size="small" color="#ffffff" />
//                         ) : (
//                             <Text style={styles.saveButtonText}>Create Request</Text>
//                         )}
//                     </TouchableOpacity>
//                 </ScrollView>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//         borderRadius: 10,

//     },
//     imagesContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//     },
//     image: {
//         width: 100,
//         height: 100,
//         margin: 5,
//         borderRadius: 8,
//         resizeMode: 'cover', // Ensure the image is scaled correctly
//     },
//     saveButton: {
//         backgroundColor: Colors.PRIMARY,
//         paddingVertical: 12,
//         borderRadius: 15,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     saveButtonText: {
//         color: '#fff',
//         fontSize: 16,
//     },
//     inputContainer: {
//         marginBottom: 16,
//     },
//     label: {
//         marginBottom: 8,
//         fontWeight: 'bold',
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         padding: 8,
//     },
//     errorInput: {
//         borderColor: 'red',
//     },
//     errorText: {
//         color: 'red',
//         marginTop: 4,
//     },
//     imageUri: {
//         marginTop: 8,
//         color: '#555',
//     },
// });


// export default CreateComplaint;
