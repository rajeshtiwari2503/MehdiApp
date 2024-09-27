import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form';
import { Colors } from '@/constants/Colors'
import http_request from "../../../http_request"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function SignIn() {
    const navigation = useNavigation()
    const router = useRouter()
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    const { control, handleSubmit, formState: { errors } } = useForm(); // Destructure control and handleSubmit from useForm
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [resErrors, setErrors] = useState(null);



    const onSubmit = async (data) => {

        Login(data);
    };
    const Login = async (reqdata) => {
        try {
            setLoading(true);
            let response = await http_request.post('/login', reqdata);
            let { data } = response;
            // console.log("data", data);
            setLoading(false);

            Toast.show({ type: 'success', text1: " data.msg" });
            await AsyncStorage.setItem('user', JSON.stringify(data));

            if (data?.user?.verification === "VERIFIED") {
                setLoading(false);
                router.push('home');
            } else {
                setLoading(false);
                router.push('home');
            }

        } catch (err) {
            setLoading(false);
            Toast.show({ type: 'error', text1: err?.response?.data?.msg });
            console.log(err);
            setErrors(err?.response?.data?.msg)
        }
    };
    const handleForgetPassword = () => {
        // Implement your logic for handling forgot password
        // const email = getValues('email'); // Note: getValues is not defined here, adjust according to your useForm setup
        const email = ''; // Placeholder, adjust as per your logic
        if (!email) {
            // Toast.show({ type: 'info', text1: 'Please enter your email' });
            return;
        }
        // router.push("ForgotPassword", { email });
    };
    return (
        <>

            <Toast />
            <SafeAreaView style={styles.containerMain}>
                <StatusBar barStyle="dark-content"
                    backgroundColor="#f8f8f8" />
                <View style={styles.container}>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Sign in to your account</Text>
                        <View style={styles.logoContainer}>

                            <Image
                                source={require('../../../assets/images/Logo.png')}
                                style={styles.logo}
                            />
                        </View>
                        <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>

                            {resErrors ? (
                                <Text style={styles.errorText}>{resErrors}</Text>
                            ) : null}
                        </View>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Email address</Text>
                                    <TextInput
                                        style={[styles.input, errors.email && styles.inputError]}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                                </View>
                            )}
                            name="email"
                            rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
                            defaultValue=""
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        style={[styles.input, errors.password && styles.inputError]}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry
                                    />
                                    {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                                </View>
                            )}
                            name="password"
                            rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } }}
                            defaultValue=""
                        />

                        <View style={styles.rememberMeContainer}>
                            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.rememberMeCheckbox}>
                                <View style={[styles.checkbox, rememberMe && styles.checkedCheckbox]}>
                                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                            </TouchableOpacity>
                            <Text>Remember me</Text>
                        </View>

                        <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.submitButton}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Sign in</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleForgetPassword} style={styles.forgotPasswordLink}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push("auth/sign-up")}
                            style={styles.signUpLink}>
                            <Text>Not a member? <Text style={styles.signUpLinkText}>Sign Up</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: "black",
        padding: 20,
        borderWidth: 1, // Add border
        borderColor: '#ccc', // Border color
        borderRadius: 10, // Border radius for rounded corners

        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 4, // Shadow radius
        // elevation: 5, // Elevation for Android shadow
        // margin: "10px"
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
        padding: 10,
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
    formContainer: {
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
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: "100%"
    },
    rememberMeCheckbox: {
        marginRight: 10,

    },
    checkbox: {
        width: 20,
        height: 20,
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedCheckbox: {
        backgroundColor: Colors.PRIMARY,

    },
    checkmark: {
        color: Colors.WHITE,
    },
    submitButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
        width: "100%"
    },
    submitButtonText: {
        color: Colors.WHITE,
        fontFamily: "outfit-bold",

        fontSize: 18,
    },
    forgotPasswordLink: {
        alignItems: 'center',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: Colors.PRIMARY,
    },
    signUpLink: {
        alignItems: 'center',
    },
    signUpLinkText: {
        color: Colors.PRIMARY,
    },
    errorText: {
        color: 'red',        // Error message color
        fontSize: 14,        // Font size for the error text
        fontWeight: 'bold',  // Make the error message bold
        marginVertical: 10,  // Add some spacing around the message
    },
});
