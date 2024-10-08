import React, {   useState ,useEffect} from 'react';
import { useRouter } from 'expo-router';
import { View, Text,  Alert, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Colors } from '@/constants/Colors';
import Toast from 'react-native-toast-message';
import { Checkbox } from 'react-native-paper';
import http_request from "../http_request";
 
 
import * as Location from 'expo-location';

export default function UserRegistrationForm({response}) {


    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const { control, handleSubmit, watch, getValues,setValue, formState: { errors } } = useForm();

    const onSubmit = data => {
        Register(data);
    };

    const Register = async (reqdata) => {
        try {
           
            setLoading(true);
            let response = await http_request.post('/createCustomer', reqdata);
            let { data } = response;
     
            setLoading(false);

            Toast.show({ type: 'success', text1: data.msg });
            router.push("auth/sign-in");
        } catch (err) {
            setLoading(false);
            Toast.show({ type: 'error', text: err?.response?.data?.msg });
            console.log(err);
            response(err?.response?.data?.msg )
        }
    };


 
 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setValue("lat",location.coords.latitude)
      setValue("long",location.coords.longitude)
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }
// console.log("chghgg",location);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>{text}</Text>
//       <Button title="Get Location" onPress={() => {
//         (async () => {
//           let { status } = await Location.requestForegroundPermissionsAsync();
//           if (status !== 'granted') {
//             Alert.alert('Permission denied', 'Permission to access location was denied');
//             return;
//           }

//           let location = await Location.getCurrentPositionAsync({});
//           setLocation(location);
//         })();
//       }} />
//     </View>
//   );
// }

    return (
        
            <View style={{marginTop:10}} >
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
                                style={[styles.input, errors.address && styles.errorInput]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Address"
                            />
                        )}
                    />
                    {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
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
       
    )
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
})