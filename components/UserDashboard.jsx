
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import RecentServicesList from './RecentServices';
import { useRouter } from 'expo-router';
import NotificationModal from './Notification';

const screenWidth = Dimensions.get('window').width;

const UserDashboard = (props) => {
  const router = useRouter();
  const navigation = useNavigation();
  const userData = props?.userData;
  const dashData = props?.dashData;
  const complaint = props?.complaints;
  const notifications = props?.notifications;
  const RefreshData = props?.RefreshData;
  const [modalVisible, setModalVisible] = useState(false);

  const showNotification = () => setModalVisible(true);
  const hideNotification = () => setModalVisible(false);

  const unreadNoti = userData?.role === 'ADMIN'
    ? notifications?.filter((item) => item?.adminStatus === 'UNREAD')
    : userData?.role === 'BRAND'
      ? notifications?.filter((item) => item?.brandStatus === 'UNREAD')
      : userData?.role === 'SERVICE'
        ? notifications?.filter((item) => item?.serviceCenterStatus === 'UNREAD')
        : userData?.role === 'TECHNICIAN'
          ? notifications?.filter((item) => item?.technicianStatus === 'UNREAD')
          : userData?.role === 'USER'
            ? notifications?.filter((item) => item?.userStatus === 'UNREAD')
            : userData?.role === 'DEALER'
              ? notifications?.filter((item) => item?.userStatus === 'UNREAD')
              : [];

  const notificationCount = unreadNoti?.length;

  const filterData = userData?.role === 'ADMIN'
    ? dashData
    : userData?.role === 'BRAND'
      ? complaint.filter((item) => item?.brandId === userData._id)
      : userData?.role === 'USER'
        ? complaint.filter((item) => item?.userId === userData._id)
        : userData?.role === 'SERVICE'
          ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
          : userData?.role === 'TECHNICIAN'
            ? complaint.filter((item) => item?.technicianId === userData._id)
            : userData?.role === 'DEALER'
              ? complaint.filter((item) => item?.dealerId === userData._id)
              : [];

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const pieChartData = [
    { name: 'AllComplaints', population: dashData?.complaints?.allComplaints || 0, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Assign', population: dashData?.complaints?.assign || 0, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Pending', population: dashData?.complaints?.pending || 0, color: 'yellow', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Complete', population: dashData?.complaints?.complete || 0, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'PartPending', population: dashData?.complaints?.partPending || 0, color: 'purple', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  const barChartData = {
    labels: ['All', 'Assign', 'Pending', 'Complete', 'PartPending'],
    datasets: [{
      data: [
        dashData?.complaints?.allComplaints || 0,
        dashData?.complaints?.assign || 0,
        dashData?.complaints?.pending || 0,
        dashData?.complaints?.complete || 0,
        dashData?.complaints?.partPending || 0,
      ]
    }]
  };

  return (
    <ScrollView>
      <View style={styles.container}>
         
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={showNotification}>
              <FontAwesome name="bell" size={24} color="black" style={styles.icon} />
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        
        <View style={styles.summaryContainer}>
          {[
            { label: 'Total Service', value: dashData?.complaints?.allComplaints, color: '#007BFF' },
            { label: 'Completed', value: dashData?.complaints?.complete, color: '#28A745' },
            { label: 'Assigned', value: dashData?.complaints?.assign, color: '#17A2B8' },
            { label: 'Pending', value: dashData?.complaints?.pending, color: '#FFC107' },
          ].map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <TouchableOpacity style={[styles.button, { backgroundColor: item.color }]}>
                <Text>{item.value}</Text>
              </TouchableOpacity>
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>

     
        {/* {pieChartData && pieChartData.length > 0 && (
  <PieChart
    data={pieChartData}
    width={screenWidth * 0.9}
    height={220}
    chartConfig={{
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    }}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
  />
)}

{barChartData && barChartData.datasets && barChartData.datasets.length > 0 && (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <BarChart
      data={barChartData}
      width={screenWidth * 1.4}
      height={220}
      chartConfig={{
        backgroundColor: '#e26a00',
        backgroundGradientFrom: '#fb8c00',
        backgroundGradientTo: '#ffa726',
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      style={styles.barChart}
    />
  </ScrollView>
)} */}


        
        <RecentServicesList data={filterData} userData={userData} />

       
        <NotificationModal
          visible={modalVisible}
          notifications={notifications}
          value={userData}
          RefreshData={RefreshData}
          message="This is a notification message!"
          onClose={hideNotification}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontFamily: 'outfit-medium',
    color: '#333',
  },
  icon: {
    padding: 5,
    backgroundColor: Colors.GRAY,
    borderRadius: 50,
  },
  iconContainer: {
    position: 'relative',
    paddingHorizontal: 10,
  },
  notificationBadge: {
    position: 'absolute',
    right: 0,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    width: '48%',
    marginBottom: 10,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  barChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default UserDashboard;
