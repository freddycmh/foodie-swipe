import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SwipeCard = ({ restaurant, index, total }) => {
  if (!restaurant) return null;

  return (
    <View style={styles.card}>
      <Image
        source={
          restaurant.image
            ? { uri: restaurant.image }
            : require('../assets/no-image.png')
        }
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{restaurant.name || 'Unknown Restaurant'}</Text>
      <Text style={styles.rating}>⭐ {restaurant.rating || 'N/A'}</Text>
      <Text style={styles.phone}>
        {restaurant.phone && restaurant.phone !== 'N/A'
          ? restaurant.phone
          : 'Phone not available'}
      </Text>
      <Text style={styles.counter}>
        {index + 1} / {total}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    height: '80%',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  counter: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

export default SwipeCard;