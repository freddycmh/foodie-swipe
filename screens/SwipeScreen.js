import React, { useEffect, useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getUserLocation } from '../utils/location';
import { fetchNearbyRestaurants } from '../utils/places';
import { LikedContext } from '../context/LikedContext';
import { FilterContext } from '../context/FilterContext';
import SwipeCard from '../components/SwipeCard';

const SwipeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { setLiked } = useContext(LikedContext);
  const { filters } = useContext(FilterContext);

  const [restaurants, setRestaurants] = useState([]);
  const [localLiked, setLocalLiked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const coords = await getUserLocation();
        const results = await fetchNearbyRestaurants(
          coords.latitude,
          coords.longitude,
          filters || {}
        );
        setRestaurants(results);
        setLocalLiked([]);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      loadRestaurants();
    }
  }, [isFocused, filters]);

  const onSwipedRight = (index) => {
    const liked = restaurants[index];
    if (liked) {
      const updated = [...localLiked, liked];
      setLocalLiked(updated);
      if (updated.length === 10) {
        setLiked(updated);
        navigation.navigate('Result');
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={restaurants}
        renderCard={(restaurant, index) =>
          restaurant ? (
            <SwipeCard
              restaurant={restaurant}
              index={index}
              total={restaurants.length}
            />
          ) : null
        }
        onSwipedRight={onSwipedRight}
        onSwiped={(i) => {}}
        cardIndex={0}
        backgroundColor="transparent"
        stackSize={3}
        verticalSwipe={false}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: { label: { color: 'red', fontSize: 24 } },
          },
          right: {
            title: 'LIKE',
            style: { label: { color: 'green', fontSize: 24 } },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default SwipeScreen;