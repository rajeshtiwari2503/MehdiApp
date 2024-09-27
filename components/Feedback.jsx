import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import http_request from '../http_request';
import FeedbackList from './FeedbackList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TechFeedbacks from './TechFeedback';

const UserFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [refresh, setRefresh] = useState("");
  const [value, setValue] = useState(null);

  useEffect(() => {
    const getStoredValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("user");
        if (storedValue) {
          setValue(JSON.parse(storedValue));
        }
      } catch (err) {
        console.error('Failed to retrieve stored value', err);
      }
    };
    getStoredValue()
    getAllFeedback();
  }, [refresh]);

  const getAllFeedback = async () => {
    try {
      const storedValue = await AsyncStorage.getItem("user");
     
        const userDT=JSON.parse(storedValue);
   
      setIsLoading(true); // Set loading to true before fetching data
      const endPoint=userDT?.user?.role==="TECHNICIAN"?`/getFeedbackByTechnicianId/${userDT?.user?._id}`:`/getFeedbackByUserId/${userDT?.user?._id}`
      let response = await http_request.get(endPoint);
      let { data } = response;
      setFeedbacks(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  const data = feedbacks?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data);
  };

  return (
    <>
    <View style={styles.container}>
  {isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />  
  ) : (
    value?.user?.role === "TECHNICIAN" ? (
      <TechFeedbacks data={data} RefreshData={RefreshData} />
    ) : (
      <FeedbackList data={data} RefreshData={RefreshData} />
    )
  )}
</View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
 
    marginBottom:5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default UserFeedbacks;
