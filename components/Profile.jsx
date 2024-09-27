import { View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import http_request from "../http_request";
import UserProfile from './UserProfile';
import TechnicianProfile from './TechnicianProfile';
import DealerProfile from './DealerProfile';
// import ServiceCenterProfile from './ServiceCenterProfile';

export default function Profile() {

  const router = useRouter()

  const [refresh, setRefresh] = useState("")
  const [userValue, setUserValue] = useState(null)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUserById = async () => {
      try {
        setLoading(true)
        const storedValue = await AsyncStorage.getItem("user");
        if (storedValue) {
          const userData = JSON.parse(storedValue);
          setUserValue(userData);
          const response = await http_request.get(`/getProfileById/${userData?.user?._id}`);
          const { data } = response;
          setUsers(data);
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
        console.error('Failed to fetch user data:', err);
      }
    };
    getUserById()
  }, [refresh]);

  const RefreshData = (data) => {
    setRefresh(data)
  }
  const userData = users?.user?.role ? (users?.user) : users?.service?.role ? (users?.service) : users?.technician?.role ? (users?.technician) : users?.dealer?.role ? (users?.dealer) : users?.brand
  const user = userData;
  // console.log(user);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');

      router.push("/auth/sign-in"); // Navigate to login page after logout
    } catch (error) {
      console.log('Error clearing user data', error);
    }
  };

  return (
    <>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffffff", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#3F51B5" />
        </View>
      ) : (
        <>
          {userValue?.user?.role === "USER" && <UserProfile user={user} RefreshData={RefreshData} handleLogout={handleLogout} />}
          {userValue?.user?.role === "DEALER" && <DealerProfile user={user} RefreshData={RefreshData} handleLogout={handleLogout} />}
          {userValue?.user?.role === "TECHNICIAN"  && <TechnicianProfile user={user} RefreshData={RefreshData} handleLogout={handleLogout} />}
          {/* {userValue?.user?.role === "SERVICE"  && <ServiceCenterProfile user={user} RefreshData={RefreshData} handleLogout={handleLogout} />} */}
        </>
      )}
    </>
  );
};







