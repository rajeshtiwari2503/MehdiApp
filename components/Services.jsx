import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import http_request from "../http_request"; // Assuming this is your HTTP request module
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ServiceDetails from './ServiceDetails';
import { MaterialIcons } from '@expo/vector-icons';
import UpdateServiceStatus from './UpdateServiceStatus';
import ServiceRequestForm from './CreateServiceRequest';
import PartOrder from './PartOrder';
import AddFeedback from './AddFeedback';
import Toast from 'react-native-toast-message';
import Map from "./Map"
import * as Location from 'expo-location';
import Geolocation from 'react-native-geolocation-service';

const getStatusStyle = (status) => {
    switch (status) {
        case 'IN PROGRESS':
            return styles.inProgress;
        case 'PART PENDING':
            return styles.partPending;
        case 'PENDING':
            return styles.pending;
        case 'ASSIGN':
            return styles.assign;
        case 'COMPLETED':
            return styles.completed;
        case 'CANCELED':
            return styles.canceled;
        default:
            return styles.defaultStatus;
    }
};

export default function ViewComplaints() {
    const router = useRouter();
    const [loading, setloading] = useState(false);
    const [isMap, setIsMap] = useState(false);
    const [lantLong, setLatLong] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [refresh, setRefresh] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedOrder, setSelectedOrder] = useState('');
    const [userData, setUserData] = useState(null);
    const [sampleComplaints, setComplaint] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [locationCurrent, setLocationCurrent] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // Request foreground permissions
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
    
                // Force the location update by passing options
                let locationCurr = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High, // Adjust accuracy as needed
                    maximumAge: 0,                    // Ensure no cached result
                    timeInterval: 2000                // Optional: Set a time interval for getting location
                });
    
                // console.log(locationCurr);
    
                // Update the state with the new location
                setLocationCurrent(locationCurr);
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        }, 2000);
    
        getAllComplaint();
    
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    
    }, []);
    

    const getLiveLocation = async () => {
        const locPermissionDenied = await locationPermission()
        if (locPermissionDenied) {
            const res = await Geolocation.requestAuthorization("whenInUse")
            console.log(res);
            
            setLocationCurrent({ lat: latitude, long: longitude });
        }
        const res = await Geolocation.requestAuthorization("whenInUse")
        console.log(res);
    }
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (locationCurrent) {
        text = `Latitude: ${locationCurrent.coords.latitude}, Longitude: ${locationCurrent.coords.longitude}`;
    }

    const getAllComplaint = async () => {
        try {
            setloading(true);
            const storedValue = await AsyncStorage.getItem('user');
            const user = JSON.parse(storedValue);
            setUserData(user?.user)
            let response = await http_request.get("/getAllComplaint");
            let { data } = response;
            const filteredData = user?.user.role === "ADMIN" ? data
                : user?.user.role === "BRAND" ? data.filter((item) => item?.brandId === user?.user?._id)
                    : user?.user.role === "USER" ? data.filter((item) => item?.userId === user?.user?._id)
                        : user?.user.role === "SERVICE" ? data.filter((item) => item?.assignServiceCenterId === user?.user?._id)
                            : user?.user.role === "TECHNICIAN" ? data.filter((item) => item?.technicianId === user?.user?._id)
                                : user?.user.role === "DEALER" ? data.filter((item) => item?.userId === user?.user?._id)
                                    : []
            const data1 = filteredData?.map((item, index) => ({ ...item, i: index + 1 }));
            setComplaint(data1);
            setloading(false);
        }
        catch (err) {
            setloading(false);
            console.log(err);
        }
    }
    // const filteredComplaints = filterComplaints(selectedCategory);

    const filterComplaints = (category) => {
        if (category === 'All') {
            return sampleComplaints;
        } else {
            return sampleComplaints.filter(complaint => complaint.status === category);
        }
    };

    const handleCategoryPress = (category) => {
        setSelectedCategory(category);
    };

    const handleDetails = (item) => {
        setSelectedService(item);
        setModalVisible(true);
    }
    const handleOrder = (item) => {
        setSelectedOrder(item);
        setOrderModalVisible(true);
    }
    const handleUpdate = (item) => {
        setSelectedService(item);
        setUpdateModalVisible(true);
    }
    const handleCreateService = () => {
        setCreateModalVisible(true);
    }
    const handleFeedback = (item) => {
        setSelectedService(item);
        setFeedbackModalVisible(true);
    }
    const RefreshData = (data) => {
        setRefresh(data);
    }

    // console.log(userData);
    
    const amount = 1;

    const userPayment = async (item) => {
        try {

            const storedValue = await AsyncStorage.getItem('user');
            const userData = JSON.parse(storedValue);
            let response = await http_request.post("/payment", { amount: +amount });
            let { data } = response;
            const options = {
                key: "rzp_live_XyovAK0BmNvrWI", // Enter the Key ID generated from the Dashboard
                amount: +amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: "Lybley", //your business name
                description: "Payment for order",
                image: "/Logo.png",
                order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (orderDetails) {
                    try {

                        let response = await axios.post("https://lybleycrmserver-production.up.railway.app/paymentVerificationForUser", { response: orderDetails, item, amount });
                        let { data } = response;
                        if (data?.status === true) {
                            ToastMessage(data)
                            props?.RefreshData(data)
                        }

                    } catch (err) {
                        console.log(err);
                    }
                },
                prefill: {
                    name: userData?.user?.name, //your customer's name
                    email: userData?.user?.email,
                    contact: userData?.user?.contact
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            console.log(err);
        }
    }
    const renderItem = ({ item, index }) => (
        <View key={index} style={styles.row}>
            <Text style={{ width: 50 }}>{item.i}</Text>
            <Text style={[{ paddingLeft: 13, width: 120 }]}>{item.productName}</Text>
            <Text style={[styles.statusCell, getStatusStyle(item?.status)]}>{item?.status === "ASSIGN" ? "ASSIGNED" : item?.status}</Text>
            <Text style={styles.cell}>{new Date(item.updatedAt).toLocaleString()}</Text>
            <View style={styles.actions}>
                {userData?.role === "TECHNICIAN" &&
                    ["ASSIGN", "PART PENDING", "IN PROGRESS", "PENDING"].includes(item?.status) ? (
                    <>
                        <TouchableOpacity onPress={() => handleUpdate(item)}>
                            <MaterialIcons name="system-update-alt" size={24} color="green" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => handleOrder(item)}>
                            <MaterialIcons name="update" size={24} color="blue" />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => handleMapData(item?.lat, item?.long)}>
                            <MaterialIcons name="my-location" size={24} color="green" />
                        </TouchableOpacity>

                    </>
                ) : null
                }

                {(userData?.role === 'USER' || userData?.role === 'DEALER') && ["COMPLETED"].includes(item?.status) ? (
                    // <View style={{display:"flex"}}>
                    <>
                        <TouchableOpacity
                            onPress={() => handleFeedback(item)}
                            style={styles.feedbackButton}
                        >
                            <Text style={styles.feedbackButtonText}>Give Feedback</Text>
                        </TouchableOpacity>

                        {item?.payment === 0 && (
                            <TouchableOpacity
                                onPress={() => userPayment(item)}
                                style={styles.payButton}
                            >
                                <Text style={styles.payButtonText}>Pay</Text>
                            </TouchableOpacity>
                        )}
                        {/* <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => handleMapData(item?.lat, item?.long)}>
                            <MaterialIcons name="my-location" size={24} color="green" />
                        </TouchableOpacity> */}
                    </>
                    // </View>
                ) : null
                }

                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => handleDetails(item)}>
                    <Ionicons name="eye" size={24} color="green" />
                </TouchableOpacity>
                
            </View>
        </View>
    );
    // const handleMap=()=>{
    //     setIsMap(!isMap)
    // }
    const handleMapData = (lat, long) => {
// console.log(lat, long);

        if(!lat || !long){
            Alert.alert("Error", "Invalid location coordinates provided.");
        }else{
            setLatLong({ lat: lat, long: long })
            setIsMap(true)
        }
       
    }
    // console.log(locationCurrent?.coords?.latitude,locationCurrent?.coords?.longitude);
    const techLocation = { lat: locationCurrent?.coords?.latitude, long: locationCurrent?.coords?.longitude }
    return (
        < >
            {/* {isMap === true && locationCurrent && lantLong  */}
            {isMap && techLocation?.lat && lantLong?.lat && lantLong?.long 
            ? <Map lantLong={lantLong} techLocation={techLocation} handleMap={() => setIsMap(false)} />
                :
                <View style={styles.container}>
                    <Toast />

                    <View  >
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.categoryButton, selectedCategory === 'All' && styles.selectedButton]}
                                onPress={() => handleCategoryPress('All')}
                            >
                                <Text style={styles.buttonText}>All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.categoryButton, selectedCategory === 'PENDING' && styles.selectedButton]}
                                onPress={() => handleCategoryPress('PENDING')}
                            >
                                <Text style={styles.buttonText}>Pending</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.categoryButton, selectedCategory === 'ASSIGN' && styles.selectedButton]}
                                onPress={() => handleCategoryPress('ASSIGN')}
                            >
                                <Text style={styles.buttonText}>Assigned</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.categoryButton, selectedCategory === 'COMPLETED' && styles.selectedButton]}
                                onPress={() => handleCategoryPress('COMPLETED')}
                            >
                                <Text style={styles.buttonText}>Closed</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    {userData?.user?.role === "USER" || "DEALER" ?
                        <TouchableOpacity style={styles.button} onPress={handleCreateService}>
                            <Text style={styles.buttonText}>Create Service Request</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {loading ?
                        <ActivityIndicator size="large" color="#0000ff" />
                        : <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>

                            <View>
                                <View style={styles.header}>
                                    <Text style={[styles.headerCell, { width: 60 }]}>Sr. No.</Text>
                                    <Text style={[styles.headerCell, { width: 120 }]}>Product </Text>
                                    <Text style={[styles.headerCell, { textAlign: "center", paddingRight: 20 }]}>Status</Text>
                                    <Text style={styles.headerCell}>Updated At</Text>
                                    <Text style={[styles.headerCell, { textAlign: 'center' }]}>Actions</Text>
                                </View>
                                <FlatList
                                    data={filterComplaints(selectedCategory)}
                                    keyExtractor={item => item?._id}
                                    renderItem={renderItem}
                                    contentContainerStyle={styles.listContainer}
                                />
                            </View>

                        </ScrollView>
                    }
                    <ServiceDetails
                        isVisible={isModalVisible}
                        onClose={() => setModalVisible(false)}
                        service={selectedService}
                    />
                    <UpdateServiceStatus
                        isVisible={updateModalVisible}
                        onClose={() => setUpdateModalVisible(false)}
                        service={selectedService}
                        RefreshData={RefreshData}
                    />
                    <PartOrder
                        isVisible={orderModalVisible}
                        onClose={() => setOrderModalVisible(false)}
                        service={selectedOrder}
                        RefreshData={RefreshData}
                    />
                    <ServiceRequestForm
                        isVisible={createModalVisible}
                        onClose={() => setCreateModalVisible(false)}
                        // user={user}
                        // onSave={handleSave}
                        RefreshData={RefreshData}
                    />
                    <AddFeedback
                        isVisible={feedbackModalVisible}
                        onClose={() => setFeedbackModalVisible(false)}
                        complaints={selectedService}
                        // user={user}
                        // onSave={handleSave}
                        RefreshData={RefreshData}
                    />
                </View>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 30
    },
    tabCont: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        // paddingLeft: 20,
        // paddingRight: 20,
        paddingTop: 10,
        width: "100%",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 30
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: '#333', // Dark background for tabs
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: "space-between",
        //     marginLeft:20,
        //    marginRight:20,
        overflow: 'hidden',
    },
    categoryButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#444',
    },
    selectedButton: {
        backgroundColor: '#0284c7',
        fontFamily: 'outfit',
    },
    buttonText: {

        fontFamily: 'outfit',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    listContainer: {
        paddingBottom: 20,
    },
    noFeedback: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: "90%",
        color: "red",
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f8f8f8',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'left',
        width: 110,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        alignItems: "center",
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        textAlign: 'left',
        width: 120,
    },
    statusCell: {
        flex: 1,
        textAlign: 'center',
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        fontWeight: 'bold',
        width: 120,
        marginRight: 10,
        paddingVertical: 3,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 100,
    },
    inProgress: {
        backgroundColor: "#17A2B8", // Change Colors.PENDING to your desired color for IN PROGRESS
    },
    partPending: {
        backgroundColor: "#17A2B8", // Change Colors.SECONDARY to your desired color for PART PENDING
    },
    pending: {
        backgroundColor: "#17A2B8", // Change Colors.SECONDARY to your desired color for PART PENDING
    },
    assign: {
        backgroundColor: "#A9A9A9", // Change Colors.COMPLETED to your desired color for ASSIGN
    },
    completed: {
        backgroundColor: "#28A745", // Change Colors.SUCCESS to your desired color for COMPLETED
    },
    canceled: {
        backgroundColor: "#DC3545", // Change Colors.ERROR to your desired color for CANCELED
    },
    defaultStatus: {
        backgroundColor: "#28A745", // Default background color
    },
    button: {
        marginLeft: 20,
        backgroundColor: Colors.PRIMARY, // Blue background color
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
        borderRadius: 5, // Rounded corners
        alignItems: 'center', // Center text horizontally
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.2, // Shadow opacity for iOS
        shadowRadius: 3,
        margin: 20 // Shadow radius for iOS
    },
    buttonText: {
        color: '#FFF', // White text color
        fontSize: 16, // Font size
        fontWeight: 'bold', // Bold text
    },
    feedbackButton: {
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#2e7d32',
        alignItems: 'center',
    },
    feedbackButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    payButton: {
        borderRadius: 8,
        marginLeft: 5,
        padding: 10,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        marginTop: 10,
    },
    payButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
