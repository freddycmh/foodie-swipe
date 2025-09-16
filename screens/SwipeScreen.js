import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';
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

        // Load first card details immediately before showing swiper
        if (basicList.length > 0 && basicList[0] && basicList[0].id) {
          await loadDetails(basicList[0].id);
        }

        // Preload next 9 card details in background
        basicList.slice(1, 10).forEach((r) => {
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

  const handleSwiped = (index) => {
    setCurrentIndex(index + 1);

    // Preload next 3 cards
    for (let i = index + 1; i <= index + 3 && i < restaurants.length; i++) {
      if (restaurants[i] && restaurants[i].id) {
        loadDetails(restaurants[i].id);
      }
    }
  };

  const handleLike = (index) => {
    const restaurant = restaurants[index];
    if (restaurant && restaurant.id) {
      const detail = detailsMap[restaurant.id];
      if (detail) {
        addLiked({ ...restaurant, ...detail });
      }
    }
  };

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
          <Swiper
            cards={restaurants}
            renderCard={(restaurant) => {
              if (!restaurant || !restaurant.id) {
                return null;
              }
              return (
                <SwipeCard
                  restaurant={restaurant}
                  detail={detailsMap[restaurant.id]}
                />
              );
            }}
            onSwiped={handleSwiped}
            onSwipedRight={handleLike}
            cardIndex={currentIndex}
            backgroundColor="transparent"
            stackSize={3}
          />
          <Text style={styles.counter}>
            {currentIndex + 1} / {restaurants.length}
          </Text>
        </>
      ) : (
        <Text style={styles.noResult}>No restaurants found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noResult: { marginTop: 40, fontSize: 16, textAlign: 'center' },
  counter: { textAlign: 'center', marginTop: 10, fontSize: 14, color: '#888' },
});

export default SwipeScreen;