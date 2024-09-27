// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// import { BarChart, PieChart } from 'react-native-chart-kit';
// import { useNavigation } from '@react-navigation/native';
// import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors'
// import RecentServicesList from './RecentServices';
// import { useRouter } from 'expo-router';
// import NotificationModal from './Notification';

// // import RecentServicesList from '../complaint/RecentServices';

// const UserDashboard = (props) => {
//     const router = useRouter();
//     const navigation=useNavigation()
//     const userData = props?.userData;
//     const dashData = props?.dashData;
//     const complaint = props?.complaints;
//     const notifications = props?.notifications;
//     const RefreshData = props?.RefreshData
//     const [modalVisible, setModalVisible] = useState(false);

//     const showNotification = () => {
//         setModalVisible(true);
//     };

//     const hideNotification = () => {
//         setModalVisible(false);
//     };
//     const unreadNoti = userData?.role === "ADMIN" ? notifications?.filter((item) => item?.adminStatus === "UNREAD")
//     : userData?.role === "BRAND" ? notifications?.filter((item) => item?.brandStatus === "UNREAD")
//       : userData?.role === "SERVICE" ? notifications?.filter((item) => item?.serviceCenterStatus === "UNREAD")
//         : userData?.role === "TECHNICIAN" ? notifications?.filter((item) => item?.technicianStatus === "UNREAD")
//           : userData?.role === "USER" ? notifications?.filter((item) => item?.userStatus === "UNREAD")
//             : userData?.role === "DEALER" ? notifications?.filter((item) => item?.userStatus === "UNREAD")
//               : ""

//     const notificationCount = unreadNoti?.length;



//     const filterData = userData?.role === "ADMIN" ? dashData
//         : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
//             : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
//                 : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
//                     : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
//                         : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
//                             : [];

//     const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

//     const pieChartData = [
//         { name: "AllComplaints", population: dashData?.complaints?.allComplaints || 0, color: "rgba(131, 167, 234, 1)", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//         { name: "Assign", population: dashData?.complaints?.assign || 0, color: "#F00", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//         { name: "Pending", population: dashData?.complaints?.pending || 0, color: "yellow", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//         { name: "Complete", population: dashData?.complaints?.complete || 0, color: "green", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//         { name: "PartPending", population: dashData?.complaints?.partPending || 0, color: "purple", legendFontColor: "#7F7F7F", legendFontSize: 15 },
//     ];

//     // Example bar chart data
//     const barChartData = [
//         { label: "AllComplaints", data: dashData?.complaints?.allComplaints || 0 },
//         { label: "Assign", data: dashData?.complaints?.assign || 0 },
//         { label: "Pending", data: dashData?.complaints?.pending || 0 },
//         { label: "Complete", data: dashData?.complaints?.complete || 0 },
//         { label: "PartPending", data: dashData?.complaints?.partPending || 0 },
//     ];

//     return (
        
//         <ScrollView>
//             <View style={styles.container}>
//                 {/* Replace with your React Native components and styling */}
//                 <View style={styles.headerContent}>
//                     <TouchableOpacity onPress={() => navigation.navigate('Profile')}  >
//                         <MaterialIcons name="person" size={24} color="black" style={styles.icon} />
//                     </TouchableOpacity>
//                     <Text style={styles.title}>Dashboard</Text>
//                     <View style={styles.iconContainer}>
//                         <TouchableOpacity onPress={showNotification}  >
//                             <FontAwesome name="bell" size={24} color="black" style={styles.icon} />
//                             {notificationCount > 0 && (
//                                 <View style={styles.notificationBadge}>
//                                     <Text style={styles.notificationText}>{notificationCount}</Text>
//                                 </View>
//                             )}
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 <View style={styles.summaryContainer}>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#007BFF' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.allComplaints} /> */}
//                             <Text>{dashData?.complaints?.allComplaints}</Text>
//                         </TouchableOpacity>
//                         <Text>Total Service</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#DC3545' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.complete} /> */}
//                             <Text>{dashData?.complaints?.complete}</Text>

//                         </TouchableOpacity>
//                         <Text>Completed</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#DC3545' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.assign} /> */}
//                             <Text>{dashData?.complaints?.assign}</Text>

//                         </TouchableOpacity>
//                         <Text>Assigned</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#E3F2FD' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.pending} /> */}
//                             <Text>{dashData?.complaints?.pending}</Text>

//                         </TouchableOpacity>
//                         <Text>Pending</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#E3F2FD' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.pending} /> */}
//                             <Text>{dashData?.complaints?.inProgress}</Text>

//                         </TouchableOpacity>
//                         <Text>In Progress</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#007BFF' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.zeroToOneDays} /> */}
//                             <Text>{dashData?.complaints?.zeroToOneDays}</Text>

//                         </TouchableOpacity>
//                         <Text>0-1 days service</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#007BFF' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.twoToFiveDays} /> */}
//                             <Text>{dashData?.complaints?.twoToFiveDays}</Text>

//                         </TouchableOpacity>
//                         <Text>2-5 days service</Text>
//                     </View>
//                     <View style={styles.itemContainer}>
//                         <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.button, { backgroundColor: '#007BFF' }]}>
//                             {/* <CountUp start={0} end={dashData?.complaints?.moreThanFiveDays} /> */}
//                             <Text>{dashData?.complaints?.moreThanFiveDays}</Text>

//                         </TouchableOpacity>
//                         <Text>More than Five Days Service</Text>
//                     </View>

//                     <TouchableOpacity onPress={() => navigation.navigate('Services')} style={[styles.addButton, { backgroundColor: '#007BFF' }]}>
//                         <Text style={styles.buttonText}>Add Service Request</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => navigation.navigate('Products')} style={[styles.addButton, { backgroundColor: '#28A745' }]}>
//                         <Text style={styles.buttonText}>Add Product</Text>
//                     </TouchableOpacity>
//                 </View>


//                 <PieChart
//                     data={pieChartData}
//                     width={330}
//                     height={220}
//                     chartConfig={{
//                         backgroundColor: "#e26a00",
//                         backgroundGradientFrom: "#fb8c00",
//                         backgroundGradientTo: "#ffa726",
//                         color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // Color for data slices
//                         labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // Color for labels
//                         style: {
//                             borderRadius: 16,
//                         },
//                     }}
//                     accessor="population"
//                     backgroundColor="transparent"
//                     paddingLeft="5"
//                 />
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartContainer}>
//                     <View style={{ width: 400 }}>
//                         <BarChart
//                             data={{
//                                 labels: barChartData.map(item => item.label),
//                                 datasets: [{
//                                     data: barChartData.map(item => item.data)
//                                 }]
//                             }}
//                             width={350}
//                             height={220}
//                             yAxisLabel=""
//                             chartConfig={{
//                                 backgroundColor: "#e26a00",
//                                 backgroundGradientFrom: "#fb8c00",
//                                 backgroundGradientTo: "#ffa726",
//                                 decimalPlaces: 0,
//                                 color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//                                 labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//                                 style: {
//                                     borderRadius: 16,
//                                 },
//                                 propsForLabels: {
//                                     fontSize: 7,
//                                 },
//                             }}
//                             style={{
//                                 marginVertical: 8,
//                                 borderRadius: 16,
//                             }}
//                         />
//                     </View>
//                 </ScrollView>

//                 <RecentServicesList data={filterData} userData={userData} />
//                 <NotificationModal
//                     visible={modalVisible}
//                     notifications={notifications}
//                     value={userData}
//                     RefreshData={RefreshData}
//                     message="This is a notification message!"
//                     onClose={hideNotification}
//                 />
//             </View>
//         </ScrollView>

//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
       
//         backgroundColor: '#fff',
//         // marginTop: 25,
//         borderRadius: 30
//     },
//     gridContainer: {
//         // flexDirection: 'row',
//         // justifyContent: 'space-between',

//         marginTop: 20,
//         marginBottom: 10,
//     },
//     headerContent: {
//         marginTop: 5,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: "space-between"
//     },
//     title: {
//         fontSize: 25,
//         fontFamily: 'outfit-medium',
//         marginHorizontal: 10,
//     },
//     icon: {
//         marginHorizontal: 10,
//         padding: 5,
//         backgroundColor: Colors.GRAY,
//         borderRadius: 50,
//         marginBottom: 10
//     },
//     iconContainer: {
//         position: 'relative',
//         paddingHorizontal: 10,
//     },
//     notificationBadge: {
//         position: 'absolute',
//         right: 10,
//         top: -1,
//         backgroundColor: 'red',
//         borderRadius: 10,
//         width: 20,
//         height: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     notificationText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
//     summaryContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//         backgroundColor: '#f0f8ff',
//         borderRadius: 10,
//         padding: 10,
//         marginBottom: 10,
//     },
//     itemContainer: {
//         alignItems: 'center',
//         marginBottom: 10,
//         width: '45%',
//     },
//     button: {
//         width: 50,
//         height: 50,
//         borderRadius: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     addButton: {
//         width: 140,
//         height: 50,
//         borderRadius: 15,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     chartContainer: {
//         flexDirection: 'col',
//         marginHorizontal: 10,
//         marginBottom: 10,
//     },
// });

// export default UserDashboard;


 
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
