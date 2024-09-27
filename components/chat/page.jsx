import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity,   FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import http_request from '../../http_request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatReply from './ChatReply';

 

const Chat = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [value, setValue] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoredValue = async () => {
      const storedValue = await AsyncStorage.getItem("user");
      const userType = JSON.parse(storedValue);
      setValue(userType);
      fetchChatMessages();
    };
    fetchStoredValue();
  }, []);

  const fetchChatMessages = async () => {
    try {
        setIsLoading(true);
        const storedValue = await AsyncStorage.getItem("user");
    const userType = JSON.parse(storedValue);
      let response = await http_request.get(`/getAllChatTicket`);
      let { data } = response;
      const chat = data?.find((item) => item?.userId === userType?.user?._id);
 
      if (chat) {
        setShowChat(true);
      }
      setIsLoading(false);
      setChatMessages(data);
    } catch (error) {
        setIsLoading(false);
      console.error('Error fetching chat messages:', error);
    }
  };

  const sendMessageRequest = async () => {
    const storedValue = await AsyncStorage.getItem("user");
    const userType = JSON.parse(storedValue);
    await AsyncStorage.setItem("userTickId", userType?.user?._id);
    const data = { userId: userType?.user?._id, userName: userType?.user?.name };
    const chat = chatMessages?.find((item) => item?.userId === userType?.user?._id);
 
    if (chat) {
      setShowChat(true);
    } else {
      try {
        await http_request.post('/addChatTicket', data);
        setMessage('');
        Toast.show({
          type: 'success',
          text1: 'Message sent successfully!',
        });
        setShowChat(true);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

 

  return (
    <View style={styles.container}>
      <Toast />
     
      {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator
        ) : ( <>
      {showChat ? 
        <ChatReply />
       : 
          <TouchableOpacity onPress={sendMessageRequest} style={styles.createChatButton}>
            <Text style={styles.createChatButtonText}>Create Chat with Support Team</Text>
          </TouchableOpacity>
        
       }
       </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#fff',
    borderRadius:15
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  chatIndex: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  chatIndexText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  chatUserName: {
    marginLeft: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  createChatButton: {
    backgroundColor: '#ffeb3b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createChatButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Chat;
