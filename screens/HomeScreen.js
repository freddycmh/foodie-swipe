import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { getUserLocation } from '../utils/location';
import { fetchNearbyRestaurants } from '../utils/places';

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const coords = await getUserLocation();
        const data = await fetchNearbyRestaurants(coords.latitude, coords.longitude);
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nearby Restaurants</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.place_id || item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>{item.address || item.vicinity}</Text>
            <Text style={styles.info}>⭐ {item.rating || 'N/A'}</Text>
            <Text style={styles.info}>
              ☎ {item.phone !== 'N/A' ? item.phone : 'Phone not available'}
            </Text>
            {item.hours?.[0] && (
              <Text style={styles.info}>🕒 {item.hours[0]}</Text> // Only show today's hours
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF5A5F',
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderColor: '#eee',
    borderWidth: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});

export default HomeScreen;