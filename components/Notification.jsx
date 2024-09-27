import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from "../http_request";
import { MaterialIcons } from '@expo/vector-icons';

const NotificationModal = ({ notifications, RefreshData, value, visible, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const notificationsPerPage = 5;

    const currentNotifications = notifications?.slice(
        currentPage * notificationsPerPage,
        (currentPage + 1) * notificationsPerPage
    );

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if ((currentPage + 1) * notificationsPerPage < notifications?.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleReadMark = async (id) => {
        const storedValue = await AsyncStorage.getItem('user');
        const userType = JSON.parse(storedValue);
        try {
            const status = (userType?.user?.role) === "ADMIN" ? { adminStatus: "READ" }
                : (userType?.user?.role) === "USER" ? { userStatus: "READ" }
                    : (userType?.user?.role) === "BRAND" ? { brandStatus: "READ" }
                        : (userType?.user?.role) === "SERVICE" ? { serviceCenterStatus: "READ" }
                            : (userType?.user?.role) === "TECHNICIAN" ? { technicianStatus: "READ" }
                                : (userType?.user?.role) === "DEALER" ? { dealerStatus: "READ" }
                                    : "";

            let response = await http_request.patch(`/editNotification/${id}`, status)
            let { data } = response;
            RefreshData(data)
        } catch (err) {
            console.log(err);
        }
    };

    const handleNotificationPress = (notification) => {
        setSelectedNotification(notification);
    };

    const renderItem = ({ item, index }) => (

        <View key={item._id} style={styles.notificationContainer}>
            <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{index + 1 + currentPage * notificationsPerPage}</Text>
            </View>
            <View style={styles.notificationContent}>
                <TouchableOpacity onPress={() => handleNotificationPress(item)} style={{ flex: 1 }}>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                </TouchableOpacity>

                {(
                    (value?.role === "USER" && item?.userStatus === "UNREAD") ||
                    (value?.role === "TECHNICIAN" && item?.technicianStatus === "UNREAD") ||
                    (value?.role === "DEALER" && item?.dealerStatus === "UNREAD")
                ) && (
                        <TouchableOpacity
                            onPress={() => handleReadMark(item?._id)}
                            style={styles.buttonRead}
                        >
                            <Text style={styles.buttonReadText}>Mark as Read</Text>
                        </TouchableOpacity>
                    )}
            </View>
        </View>
    );

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            style={styles.modal}
        >
            <View style={styles.container}>

                <View style={{ flexDirection: 'row', alignItems: 'center',   }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1 }}>
                        Notifications
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="cancel" size={40} color="red" />
                    </TouchableOpacity>
                </View>
           
            {notifications?.length > 0 ? (
                <FlatList
                    data={currentNotifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?._id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text>No notifications</Text>
            )}
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    onPress={handlePrevPage}
                    style={[styles.button, currentPage === 0 && styles.buttonDisabled]}
                    disabled={currentPage === 0}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleNextPage}
                    style={[
                        styles.button,
                        (currentPage + 1) * notificationsPerPage >= notifications?.length && styles.buttonDisabled
                    ]}
                    disabled={(currentPage + 1) * notificationsPerPage >= notifications?.length}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* {selectedNotification && (
                    <Modal
                        isVisible={!!selectedNotification}
                        onBackdropPress={() => setSelectedNotification(null)}
                        onSwipeComplete={() => setSelectedNotification(null)}
                        swipeDirection={['down']}
                        animationIn="slideInUp"
                        animationOut="slideOutDown"
                        backdropOpacity={0.5}
                        style={styles.overlay}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.notificationMessage}>{selectedNotification.message}</Text>
                            <TouchableOpacity
                                onPress={() => handleReadMark(selectedNotification._id)}
                                style={styles.buttonRead}
                            >
                                <Text style={styles.buttonReadText}>Mark as Read</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedNotification(null)} style={styles.closeButton}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )} */}
        </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    modal: {
        // justifyContent: 'flex-end',
        // margin: 0,
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
    },
    list: {
        flexGrow: 1,
    },
    notificationContainer: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    numberContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#6b7280',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    numberText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    notificationContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationMessage: {
        flex: 1,
        fontSize: 16,
    },
    buttonRead: {
        backgroundColor: '#34d399',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginLeft: 8,
    },
    buttonReadText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#d1d5db',
    },
    closeButton: {
        backgroundColor: '#f87171',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginTop: 10,
        alignItems: 'center',
    },
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default NotificationModal;
