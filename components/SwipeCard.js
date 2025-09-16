import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getUserLocation } from '../utils/location';
import { calculateDistance } from '../utils/distance';

const { width: screenWidth } = Dimensions.get('window');

const SwipeCard = ({ restaurant, detail }) => {
  const image = detail?.image || 'https://via.placeholder.com/400x300/f0f0f0/999999?text=🍽️+Loading+Image';
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);

        // Calculate distance if we have restaurant coordinates
        if (restaurant.coordinates && location) {
          const dist = calculateDistance(
            location.latitude,
            location.longitude,
            restaurant.coordinates.latitude,
            restaurant.coordinates.longitude
          );
          setDistance(dist);
        }
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    };

    getLocation();
  }, [restaurant.coordinates]);

  const openDirections = async () => {
    if (!detail?.address && !restaurant.vicinity && !restaurant.address) {
      Alert.alert('Address Not Available', 'Sorry, we don\'t have the address for this restaurant.');
      return;
    }

    const address = detail?.address || restaurant.vicinity || restaurant.address;
    const encodedAddress = encodeURIComponent(address);

    let url;
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${encodedAddress}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps application.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open directions.');
      console.error('Error opening directions:', error);
    }
  };

  const makePhoneCall = async () => {
    if (!detail?.phone) {
      Alert.alert('Phone Not Available', 'Sorry, we don\'t have the phone number for this restaurant.');
      return;
    }

    // Clean the phone number - remove spaces, parentheses, dashes
    const cleanNumber = detail.phone.replace(/[^\d+]/g, '');
    const phoneUrl = `tel:${cleanNumber}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Unable to open phone application.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call.');
      console.error('Error making phone call:', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.gradient} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {restaurant.rating || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{restaurant.name}</Text>

        {/* Map and Distance */}
        {restaurant.coordinates && userLocation && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: (userLocation.latitude + restaurant.coordinates.latitude) / 2,
                longitude: (userLocation.longitude + restaurant.coordinates.longitude) / 2,
                latitudeDelta: Math.abs(userLocation.latitude - restaurant.coordinates.latitude) * 2.5 || 0.01,
                longitudeDelta: Math.abs(userLocation.longitude - restaurant.coordinates.longitude) * 2.5 || 0.01,
              }}
              showsUserLocation={false}
              showsMyLocationButton={false}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor="blue"
              />
              <Marker
                coordinate={restaurant.coordinates}
                title={restaurant.name}
                pinColor="red"
              />
            </MapView>
            {distance && (
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>📍 {distance}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.detailsContainer}>
          {detail?.phone ? (
            <TouchableOpacity style={[styles.detailRow, styles.phoneRow]} onPress={makePhoneCall} activeOpacity={0.7}>
              <Text style={styles.detailIcon}>📞</Text>
              <Text style={styles.phone}>{detail.phone}</Text>
              <Text style={styles.callIcon}>📱</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.detailRow}>
              <ActivityIndicator size="small" color="#ff6b6b" />
              <Text style={styles.loadingText}>Loading phone...</Text>
            </View>
          )}

          {detail?.hours?.length ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>🕐</Text>
              <Text style={styles.hours}>{detail.hours[0]}</Text>
            </View>
          ) : (
            <View style={styles.detailRow}>
              <ActivityIndicator size="small" color="#ff6b6b" />
              <Text style={styles.loadingText}>Loading hours...</Text>
            </View>
          )}

          {(detail?.address || restaurant.vicinity || restaurant.address) ? (
            <TouchableOpacity style={[styles.detailRow, styles.addressRow]} onPress={openDirections} activeOpacity={0.7}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.address} numberOfLines={2}>
                {detail?.address || restaurant.vicinity || restaurant.address}
              </Text>
              <Text style={styles.directionsIcon}>🧭</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.detailRow}>
              <ActivityIndicator size="small" color="#ff6b6b" />
              <Text style={styles.loadingText}>Loading address...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  info: {
    padding: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 16,
    lineHeight: 28,
  },
  detailsContainer: {
    width: '100%',
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minHeight: 36,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  phoneRow: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  phone: {
    fontSize: 15,
    color: '#1565c0',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  callIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  hours: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#95a5a6',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  addressRow: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  address: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    lineHeight: 18,
  },
  directionsIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  mapContainer: {
    width: '100%',
    height: 120,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default SwipeCard;