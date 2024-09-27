import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import http_request from '../../http_request';

const ChatReply = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [value, setValue] = useState(null);

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
        const storedValue = await AsyncStorage.getItem("userTickId");
        try {
            let response = await http_request.get(`/getChatTicketByUserId/${storedValue}`);
            let { data } = response;
            setChatMessages(data);
            
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessage = async (id, name) => {
        const userId = id;
        const sender = value?.user?.role === "ADMIN" ? "admin" : "user";
        try {
            await http_request.post('/sendMessage', { userId, sender, message });
            Toast.show({
                type: 'success',
                text1: 'Your messages is successfully!',
            });
            setMessage('');
            fetchChatMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputChange = (text) => {
        setMessage(text);
    };

    const sortedMessages = chatMessages?.messages?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <View style={styles.container}>
            <Toast />
            {/* <View style={styles.header}>
                <Text style={styles.headerText}>Chat Message</Text>
            </View> */}
            <View style={styles.rolesContainer}>
                <View style={styles.role}>
                    <Text style={styles.roleText}>Support Team</Text>
                </View>
                <View style={styles.role}>
                    <Text style={styles.roleText}>You</Text>
                </View>
            </View>
            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {sortedMessages?.map((msg, index) => (
                    <View key={index} style={[styles.messageWrapper, msg.sender === 'user' ? styles.userMessageWrapper : null]}>
                        <View style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.adminMessage]}>
                            <Text style={styles.messageText}>{msg.message}</Text>
                            <Text style={styles.timestamp}>{new Date(msg.timestamp).toLocaleString()}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={handleInputChange}
                    placeholder="Type your message..."
                    style={styles.input}
                />
                <TouchableOpacity onPress={() => sendMessage(chatMessages?.userId, chatMessages?.userName)} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        width:350,
        borderRadius:15
    },
    header: {
        backgroundColor: '#0284c7',
        padding: 10,
        borderRadius: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    rolesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 10,
        marginBottom: 10,
    },
    role: {
        backgroundColor: '#34d399',
        padding: 5,
        borderRadius: 5,
    },
    roleText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messagesContent: {
        flexDirection: 'column-reverse',
    },
    messageWrapper: {
        marginVertical: 5,
    },
    userMessageWrapper: {
        alignItems: 'flex-end',
    },
    message: {
        padding: 10,
        borderRadius: 5,
    },
    userMessage: {
        backgroundColor: '#bfdbfe',
    },
    adminMessage: {
        backgroundColor: '#bbf7d0',
    },
    messageText: {
        fontSize: 14,
    },
    timestamp: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    sendButton: {
        backgroundColor: '#3b82f6',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatReply;
