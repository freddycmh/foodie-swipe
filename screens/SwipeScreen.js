import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList } from 'react-native';
import SwipeCard from '../components/SwipeCard';
import { fetchNearbyRestaurants, fetchPlaceDetails } from '../utils/places';
import { getUserLocation } from '../utils/location';
import { useFilter } from '../context/FilterContext';
import { useLiked } from '../context/LikedContext';

const SwipeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { filters } = useFilter();
  const { addLiked } = useLiked();

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

  const handleLike = (restaurant) => {
    if (restaurant && restaurant.id) {
      const detail = detailsMap[restaurant.id];
      if (detail) {
        addLiked({ ...restaurant, ...detail });
      }
    }
    // Move to next card
    goToNextCard();
  };

  const handleReject = (restaurant) => {
    // Optional: Add logic for rejected restaurants
    console.log('Rejected:', restaurant.name);
    // Move to next card
    goToNextCard();
  };

  const goToNextCard = () => {
    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);

      // Preload next few cards
      const nextIndex = currentIndex + 1;
      for (let i = nextIndex; i <= nextIndex + 2 && i < restaurants.length; i++) {
        if (restaurants[i] && restaurants[i].id && !detailsMap[restaurants[i].id]) {
          loadDetails(restaurants[i].id);
        }
      }
    }
  };

  const currentRestaurant = restaurants[currentIndex];

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {restaurants.length > 0 ? (
        <>
          {currentIndex < restaurants.length ? (
            <View style={styles.cardContainer}>
              <SwipeCard
                restaurant={currentRestaurant}
                detail={detailsMap[currentRestaurant?.id]}
                onLike={handleLike}
                onReject={handleReject}
              />
            </View>
          ) : (
            <View style={styles.endContainer}>
              <Text style={styles.endText}>🎉 No more restaurants!</Text>
              <Text style={styles.endSubtext}>Check your liked restaurants in the results tab</Text>
            </View>
          )}

        </>
      ) : (
        <Text style={styles.noResult}>No restaurants found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noResult: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  endContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  endText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  endSubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SwipeScreen;