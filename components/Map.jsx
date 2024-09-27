// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

// export default function Map(props) {
//     const { handleMap, lantLong, techLocation } = props;

//     const [mapState, setMapState] = useState({
//         pickupCords: {
//             latitude: parseFloat(techLocation?.lat) || 0,
//             longitude: parseFloat(techLocation?.long) || 0,
//         },
//         dropCords: {
//             latitude: parseFloat(lantLong?.lat) || 0,
//             longitude: parseFloat(lantLong?.long) || 0,
//         },
//     });

//     const GOOGLE_MAPS_APIKEY = "AIzaSyBvWULhEJHD7GpeeY3UC2C5N9dJZOIuyEg"; // Replace with your actual Google Maps API key
//     const mapRef = useRef();

//     useEffect(() => {

//         const interval = setInterval(() => {
//             if (!techLocation?.lat || !techLocation?.long || !lantLong?.lat || !lantLong?.long) {
//                 Alert.alert("Error", "Invalid location coordinates provided.");
//             }
//         }, 2000);


//         return () => clearInterval(interval);
//     },  []);
// // console.log("techLocation",techLocation);

//     if (!techLocation?.lat || !techLocation?.long || !lantLong?.lat || !lantLong?.long) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//                 <Text style={{ color: "red" }}>Invalid coordinates provided.</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={{ flex: 1 }}>
//             <TouchableOpacity onPress={handleMap}>
//                 <Text style={{ color: "white" }}>Back</Text>
//             </TouchableOpacity>
//             <MapView
//                 ref={mapRef}
//                 style={StyleSheet.absoluteFillObject}
//                 initialRegion={{
//                     latitude: mapState.pickupCords.latitude,
//                     longitude: mapState.pickupCords.longitude,
//                     latitudeDelta: 0.0922,
//                     longitudeDelta: 0.0421,
//                 }}
//             >
//                 <Marker coordinate={mapState.pickupCords} />
//                 <Marker coordinate={mapState.dropCords} />
//                 <MapViewDirections
//                     origin={mapState.pickupCords}
//                     destination={mapState.dropCords}
//                     apikey={GOOGLE_MAPS_APIKEY}
//                     strokeWidth={3}
//                     strokeColor="hotpink"
//                     optimizeWaypoints={true}
//                     onReady={result => {
//                         mapRef.current.fitToCoordinates(result.coordinates, {
//                             edgePadding: { right: 30, bottom: 300, left: 30, top: 100 },
//                         });
//                     }}
//                     onError={(errorMessage) => {
//                         console.log('MapViewDirections Error:', errorMessage);
//                     }}
//                 />
//             </MapView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function Map(props) {
    const { handleMap, lantLong, techLocation } = props;

    // Convert coordinates to float and handle defaults
    const pickupCords = {
        latitude: parseFloat(techLocation?.lat) || 0,
        longitude: parseFloat(techLocation?.long) || 0,
    };
    const dropCords = {
        latitude: parseFloat(lantLong?.lat) || 0,
        longitude: parseFloat(lantLong?.long) || 0,
    };

    const GOOGLE_MAPS_APIKEY = "AIzaSyBvWULhEJHD7GpeeY3UC2C5N9dJZOIuyEg"; // Secure the API key using environment variables
    const mapRef = useRef();

    // Effect to handle invalid coordinates
    useEffect(() => {
        if (!pickupCords.latitude || !pickupCords.longitude || !dropCords.latitude || !dropCords.longitude) {
            Alert.alert("Error", "Invalid location coordinates provided.");
        }
    }, [pickupCords, dropCords]);

    // Check if coordinates are invalid and show loader
    if (!pickupCords.latitude || !pickupCords.longitude || !dropCords.latitude || !dropCords.longitude) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ color: "red" }}>Invalid coordinates provided.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleMap} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: pickupCords.latitude,
                    longitude: pickupCords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker coordinate={pickupCords} />
                <Marker coordinate={dropCords} />
                <MapViewDirections
                    origin={pickupCords}
                    destination={dropCords}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                    optimizeWaypoints={true}
                    onReady={result => {
                        mapRef.current.fitToCoordinates(result.coordinates, {
                            edgePadding: { right: 30, bottom: 300, left: 30, top: 100 },
                        });
                    }}
                    onError={(errorMessage) => {
                        console.log('MapViewDirections Error:', errorMessage);
                    }}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 5, // Adjust this value to control the vertical position
        left: 20, // Adjust this value to control the horizontal position
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 5,
        zIndex: 1, // Ensure the button appears on top of the MapView
      },
      backButtonText: {
        color: 'white',
        fontSize: 16,
      },
});
