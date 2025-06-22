import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, SafeAreaView } from 'react-native';
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
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>{item.vicinity}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { paddingVertical: 10, borderBottomColor: '#eee', borderBottomWidth: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  info: { color: 'gray' },
});

export default HomeScreen;