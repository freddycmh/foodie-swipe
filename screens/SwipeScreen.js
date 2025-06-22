import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useNavigation } from '@react-navigation/native';
import { fetchNearbyRestaurants } from '../utils/places';
import { getUserLocation } from '../utils/location';
import { LikedContext } from '../context/LikedContext';

const { width } = Dimensions.get('window');

const SwipeScreen = () => {
  const navigation = useNavigation();
  const { setLiked } = useContext(LikedContext);

  const [restaurants, setRestaurants] = useState([]);
  const [localLiked, setLocalLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const coords = await getUserLocation();
        const data = await fetchNearbyRestaurants(coords.latitude, coords.longitude);
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const onSwipedRight = (cardIndex) => {
    const liked = restaurants[cardIndex];
    if (liked) {
      const updated = [...localLiked, liked];
      setLocalLiked(updated);

      if (updated.length === 10) {
        setLiked(updated);
        navigation.navigate('Result');
      }
    }
  };

  const renderCard = (restaurant) => {
    if (!restaurant) return null;

    const photoRef = restaurant.photos?.[0]?.photo_reference;
    const photoUrl = photoRef
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=AIzaSyAwCMpTQojHt4trQfoel3h45BzxkL7Knkg`
      : null;

    return (
      <View style={styles.card}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}><Text>No Image</Text></View>
        )}
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text>{restaurant.vicinity}</Text>
        <Text>{restaurant.rating ? `⭐ ${restaurant.rating}` : ''}</Text>
        <Text>{restaurant.formatted_phone_number || 'Phone not available'}</Text>
        {restaurant.opening_hours?.weekday_text?.map((line, i) => (
          <Text key={i} style={styles.hours}>{line}</Text>
        ))}
        <Text style={styles.progress}>{currentIndex + 1} / {restaurants.length}</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        cards={restaurants}
        renderCard={renderCard}
        onSwipedRight={onSwipedRight}
        onSwiped={(index) => setCurrentIndex(index + 1)}
        stackSize={3}
        backgroundColor="transparent"
        cardIndex={0}
        verticalSwipe={false}
        overlayLabels={{
          left: { title: 'NOPE', style: { label: { color: 'red', fontSize: 24 } } },
          right: { title: 'LIKE', style: { label: { color: 'green', fontSize: 24 } } }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: width - 60,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  placeholder: {
    width: width - 60,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hours: {
    fontSize: 12,
    color: 'gray',
  },
  progress: {
    marginTop: 8,
    color: 'gray',
  },
});

export default SwipeScreen;