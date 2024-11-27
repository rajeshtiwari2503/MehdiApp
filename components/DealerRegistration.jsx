import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import http_request from "../http_request";
import { Checkbox } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import axios from 'axios';
 

export default function DealerRegistrationForm({ response }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [aadharImage, setAadharImage] = useState(null);

    const { control, handleSubmit, getValues, formState: { errors } } = useForm();

    const onSubmit = data => {
        const repData={...data,role:"AGENT"}
        Register(repData);
    };

    const selectAadharImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
    
        if (!result.canceled) {
            console.log("Selected Image URI:", result.assets[0].uri);
            setAadharImage(result.assets[0].uri); // Save only the URI to state
        }
    };
    
    const Register = async (reqdata) => {
        try {
            setLoading(true);
    
            const formData = new FormData();
    
            // Add other request data to formData
            // Object.keys(reqdata).forEach((key) => {
            //     formData.append(key, reqdata[key]);
            // });
            formData.append('name', reqdata.name);
            formData.append('email', reqdata.email);
            formData.append('contact', reqdata.contact);
            formData.append('address', reqdata.address);
            formData.append('password', reqdata.password);
          
            formData.append('acceptedTerms', reqdata.acceptedTerms);
            formData.append('role', reqdata.role);
            // Add the image to formData if `aadharImage` is set
            if (aadharImage) {
                formData.append('aadharImage', {
                    uri: aadharImage, // Use the correct URI from state
                    type: 'image/jpeg', // Set appropriate MIME type
                    name: `${new Date().toISOString()}_aadhar.jpg`, // Unique filename
                });
            }
    
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };
    
            console.log('Sending request with formData:', formData);
            //  http://192.168.159.22:5000
            let response = await axios.post('https://mehdiappbackend.onrender.com/agentRegistration', formData, config); // Replace with your full server URL
    
            setLoading(false);
            console.log("Server Response:", response.data);
            // Uncomment if using a toast notification or navigation after success
            Toast.show({ type: 'success', text1: response.data.msg });
            router.push("auth/sign-in");
        } catch (error) {
            setLoading(false);
            console.log('Error occurred:', error);
    
            // Handle network error specifically
            if (error.message === 'Network Error') {
                console.error('Network error - Check if the API server is running and reachable.');
            }
        }
    };
    

    return (
        <View style={{ marginTop: 10 }}>
            <Toast />
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <Controller
                    control={control}
                    name="name"
                    rules={{
                        required: 'Name is required',
                        minLength: { value: 3, message: 'Name must be at least 3 characters long' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.name && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Name"
                        />
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email address</Text>
                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.email && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Contact No.</Text>
                <Controller
                    control={control}
                    name="contact"
                    rules={{
                        required: 'Contact number is required',
                        pattern: { value: /^\d{10}$/, message: 'Contact No. must be at least 10 characters long' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.contact && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Contact No."
                            keyboardType="phone-pad"
                        />
                    )}
                />
                {errors.contact && <Text style={styles.errorText}>{errors.contact.message}</Text>}
            </View>
            {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Business Registration Number</Text>
                <Controller
                    control={control}
                    name="businessRegistrationNumber"
                    rules={{
                        required: 'Business Registration Number is required',
                        minLength: { value: 6, message: 'Business Registration Number must be at least 6 characters long' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.businessRegistrationNumber && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Business Registration Number"
                        />
                    )}
                />
                {errors.businessRegistrationNumber && <Text style={styles.errorText}>{errors.businessRegistrationNumber.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>GST/VAT Number</Text>
                <Controller
                    control={control}
                    name="gstVatNumber"
                    rules={{
                        required: 'GST/VAT Number is required',
                        minLength: { value: 6, message: 'GST/VAT Number must be at least 6 characters long' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.gstVatNumber && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="GST/VAT Number"
                        />
                    )}
                />
                {errors.gstVatNumber && <Text style={styles.errorText}>{errors.gstVatNumber.message}</Text>}
            </View> */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address</Text>
                <Controller
                    control={control}
                    name="address"
                    rules={{
                        required: 'Address is required',
                        minLength: { value: 10, message: 'Address must be at least 10 characters long' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.businessAddress && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Address"
                        />
                    )}
                />
                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
            </View>
            {/* <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contact Person</Text>
                    <Controller
                        control={control}
                        name="contactPerson"
                        rules={{
                            required: 'Address is required',
                            minLength: { value: 3, message: 'Address must be at least 3 characters long' }
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.contactPerson && styles.errorInput]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Address"
                            />
                        )}
                    />
                    {errors.contactPerson && <Text style={styles.errorText}>{errors.contactPerson.message}</Text>}
                </View> */}
                 {/* Pincode Field */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pincode</Text>
                <Controller
                    control={control}
                    name="pincode"
                    rules={{
                        required: 'Pincode is required',
                        pattern: { value: /^[1-9][0-9]{5}$/, message: 'Invalid Pincode' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.pincode && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pincode"
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.pincode && <Text style={styles.errorText}>{errors.pincode.message}</Text>}
            </View>

            {/* Aadhaar Number Field */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Aadhaar Number</Text>
                <Controller
                    control={control}
                    name="aadharNo"
                    rules={{
                        required: 'Aadhaar Number is required',
                        pattern: { value: /^\d{12}$/, message: 'Invalid Aadhaar Number' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.aadharNo && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Aadhaar Number"
                            keyboardType="numeric"
                        />
                    )}
                />
                {errors.aadharNo && <Text style={styles.errorText}>{errors.aadharNo.message}</Text>}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Upload Aadhaar Image</Text>
                <TouchableOpacity onPress={selectAadharImage} style={styles.imageUploadButton}>
                    <Text style={styles.imageUploadText}>Select Image</Text>
                </TouchableOpacity>
                {aadharImage && (
                    <Image source={{ uri: aadharImage}} style={styles.previewImage} />
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters long' }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.password && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Password"
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: 'Confirm Password is required',
                        validate: value => value === getValues('password') || 'The passwords do not match'
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.confirmPassword && styles.errorInput]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Confirm Password"
                            secureTextEntry
                        />
                    )}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
            </View>
            <View style={styles.inputContainer}>
                    <Text style={styles.label}>Referral Code</Text>
                    <Controller
                        control={control}
                        name="referralCode"
                        // rules={{
                        //     required: 'Name is required',
                        //     minLength: { value: 3, message: 'Name must be at least 3 characters long' }
                        // }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.referralCode && styles.errorInput]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="referralCode"
                            />
                        )}
                    />
                     
                </View>

            <Controller
                control={control}
                name="acceptedTerms"
                rules={{ required: 'You must accept the terms and conditions' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={value ? 'checked' : 'unchecked'}
                            onPress={() => onChange(!value)}
                            color="#007bff"
                        />
                        <Text style={styles.label}>I accept the terms and conditions</Text>
                    </View>
                )}
            />
            {errors.acceptedTerms && <Text style={styles.errorText}>{errors.acceptedTerms.message}</Text>}




            <TouchableOpacity
                style={[styles.button, loading && styles.saveButtonDisabled]}
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.signInText}>
                Already registered?{' '}
                <Text onPress={() => router.push("auth/sign-in")} style={styles.signInLink}>
                    Sign In
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.GRAY, // Replace with your color
        borderRadius: 10,
        overflow: 'hidden',
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: Colors.LIGHT_GRAY, // Replace with your color
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTab: {
        backgroundColor: Colors.PRIMARY, // Replace with your color
    },
    tabText: {
        color: Colors.TEXT, // Replace with your color
        fontSize: 16,
    },
    title: {
        fontSize: 24,

        fontFamily: "outfit-bold",
        textAlign: 'center',
        marginBottom: 20,

    },
    logoContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: Colors.WHITE,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // elevation: 5,
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        marginBottom: 20,
    },
    logo: {
        width: '30%', // Take full width of parent container
        height: 70, // Set height as per your requirement
        borderRadius: 4, // Apply border radius
        resizeMode: "cover",
    },
    form: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: Colors.WHITE,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        fontFamily: "outfit"
    },
    input: {
        marginTop: 8,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        fontFamily: "outfit"
    },
    errorInput: {
        borderColor: '#ff0000',
        fontFamily: "outfit"
    },
    errorText: {
        marginTop: 4,
        color: '#ff0000',
        fontSize: 12,
        fontFamily: "outfit"
    },
    button: {
        marginTop: 14,
        padding: 16,
        borderRadius: 8,
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        fontFamily: "outfit"
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: "outfit-bold"
    },
    signInText: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        //   color: Colors.PRIMARY,
        fontFamily: "outfit"
    },
    signInLink: {
        color: Colors.PRIMARY,
        fontWeight: '600',
        fontFamily: "outfit"
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        fontFamily: "outfit",
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        fontSize: 16,
        color: '#4F46E5',
        fontFamily: "outfit"
    },
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    imageUploadButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginTop: 10,
    },
    imageUploadText: {
        color: '#fff',
        textAlign: 'center',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
    },
    saveButtonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    signInText: {
        textAlign: 'center',
        marginTop: 20,
    },
    signInLink: {
        color: '#007bff',
    },
});
