import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import DealerRegistrationForm from '../../../components/DealerRegistration';
import UserRegistrationForm from '../../../components/UserRegistration';
import TechnicianRegistrationForm from '../../../components/TechnicianRegistration';

export default function SignUp() {


    const [selectedUserType, setSelectedUserType] = useState('user');

    const navigation = useNavigation();

    const [userType, setUserType] = useState('user'); // Default user type
    const [resErrors, setErrors] = useState(null);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    });

    const handleUserTypePress = (userType) => {
        setSelectedUserType(userType);
        setUserType(userType)
    }

const response=(data)=>{
    setErrors(data)
    Alert.alert(
        "Errror",             
        JSON.stringify(data)  
      );
      
}

    return (
        <SafeAreaView style={styles.containerMain}>
            <StatusBar barStyle="dark-content"
                backgroundColor="#f8f8f8" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.title}>Create new account</Text>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/images/Logo.png')}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.tabContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity
                                style={[styles.tabButton, selectedUserType === 'user' && styles.selectedTab]}
                                onPress={() => handleUserTypePress('user')}
                            >
                                <Text style={styles.tabText}>User</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, selectedUserType === 'dealer' && styles.selectedTab]}
                                onPress={() => handleUserTypePress('dealer')}
                            >
                                <Text style={styles.tabText}>Dealer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tabButton, selectedUserType === 'technician' && styles.selectedTab]}
                                onPress={() => handleUserTypePress('technician')}
                            >
                                <Text style={styles.tabText}>Technician</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                        {resErrors ? (
                            <Text style={styles.errorText}>{resErrors}</Text>
                        ) : null}
                    </View>
                    {userType === 'user' && (
                        <>
                            <UserRegistrationForm response={response} />
                        </>
                    )}


                    {/* Conditional Fields based on User Type */}
                    {userType === 'dealer' && (
                        <>
                            <DealerRegistrationForm response={response}/>
                        </>
                    )}

                    {userType === 'technician' && (
                        <>
                            <TechnicianRegistrationForm response={response}/>
                        </>
                    )}
                    {/* <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity> */}

                    {/* <Text style={styles.signInText}>
                        Already registered?{' '}
                        <Text onPress={() => router.push("auth/sign-in")} style={styles.signInLink}>
                            Sign In
                        </Text>
                    </Text> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
    },
    container: {
        // flex:1,
        backgroundColor: "black",
        borderWidth: 1, // Add border
        borderColor: '#ccc', // Border color
        borderRadius: 10, // Border radius for rounded corners
        paddingHorizontal: 20,
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 4
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
        display: "flex"
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginLeft: 16,
        borderRadius: 10,
        backgroundColor: Colors.LIGHT_GRAY, // Replace with your color
        marginHorizontal: 5,
        justifyContent: "center",
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
        // marginBottom: 10,

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
        width: '30%', // Take full width of parent container
        height: 70, // Set height as per your requirement
        borderRadius: 4, // Apply border radius
        resizeMode: "cover",
    },
    form: {
        width: '100%',
        maxWidth: 400,
        marginTop: 34,
        backgroundColor: Colors.WHITE,
        // padding: 20,
        paddingLeft: 20,
        paddingRight: 20,
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
        // marginTop: 8,
        // padding: 12,
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
        marginTop: 24,
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
        marginTop: 16,
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
})