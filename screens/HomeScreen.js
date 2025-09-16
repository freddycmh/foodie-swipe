import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwipeCard from '../components/SwipeCard';
import { fetchNearbyRestaurants, fetchPlaceDetails } from '../utils/places';
import { getUserLocation } from '../utils/location';
import { useFilter } from '../context/FilterContext';

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { filters } = useFilter();

  useEffect(() => {
    const loadRestaurants = async () => {
      setIsLoading(true);
      try {
        const location = await getUserLocation();
        const basicList = await fetchNearbyRestaurants(location.latitude, location.longitude, filters);
        setRestaurants(basicList);

        // Load details for first few cards
        basicList.slice(0, 5).forEach((r) => {
          if (r && r.id) {
            loadDetails(r.id);
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurants();
  }, [filters]);

  const loadDetails = async (placeId) => {
    if (detailsMap[placeId]) return;
    try {
      const detail = await fetchPlaceDetails(placeId);
      setDetailsMap((prev) => ({ ...prev, [placeId]: detail }));
    } catch (err) {
      console.error('Error loading detail for', placeId, err);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderRestaurant = ({ item }) => {
    // Load details when scrolled to this item
    if (!detailsMap[item.id] && item.id) {
      loadDetails(item.id);
    }

    return (
      <View style={styles.cardContainer}>
        <SwipeCard
          restaurant={item}
          detail={detailsMap[item.id]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.place_id || item.id}
        renderItem={renderRestaurant}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          // Load more details as user scrolls
          const startIndex = Math.min(restaurants.length - 5, 5);
          restaurants.slice(startIndex, startIndex + 5).forEach((r) => {
            if (r && r.id && !detailsMap[r.id]) {
              loadDetails(r.id);
            }
          });
        }}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 20,
  },
  cardContainer: {
    marginBottom: 4,
  },
});

export default HomeScreen;