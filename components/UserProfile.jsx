import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native'
import React, {  useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '@/constants/Colors'
import EditUserProfile from './EditUserProfile';

export default function UserProfile(props) {

  const [isModalVisible, setModalVisible] = useState(false);
 
  const {user,RefreshData,handleLogout}=props
  
  return (
   
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity> */}
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user?.profilePicture }} style={styles.profileImage} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {/* <Text style={styles.location}>{user?.address}</Text> */}
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Icon name="phone" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>{user?.contact}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="verified-user" size={24} color="#FF9800" />
          <Text style={styles.infoText}>{user?.verification}</Text>
        </View>
      
        <View style={styles.infoBox}>
          <Icon name="location-on" size={24} color="#4CAF50" />
          <Text style={styles.infoText}>{user?.address}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="verified" size={24} color="#4CAF50" />
          <Text style={styles.infoText}>{user?.status}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="verified" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>{user?.acceptedTerms?"Term & Condition   Accepted":"Term & Condition not Accepted"}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="code" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>Referal Code : {user?.referralCode}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="person" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>Referred By  : {user?.referredBy}</Text>
        </View>
        <View style={styles.infoBox}>
          <Icon name="group" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>Referal Count: {user?.referralCount}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>

        </TouchableOpacity>
      </View>
      <EditUserProfile 
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
        // onSave={handleSave}
        RefreshData={RefreshData}
      />
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     backgroundColor: '#fff',
  //   },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 30
  },
  logoutButton: {
    backgroundColor: '#ff4757',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#c8d8e4',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 15
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6200EE',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  location: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop:20
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  infoContainer: {
    marginHorizontal: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 16,
  },
});





