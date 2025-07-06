import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const SwipeCard = ({ restaurant, detail }) => {
  const image = detail?.image || 'https://via.placeholder.com/400?text=Loading...';

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.rating}>⭐ {restaurant.rating || 'N/A'}</Text>

        {detail?.phone ? (
          <Text style={styles.phone}>{detail.phone}</Text>
        ) : (
          <ActivityIndicator size="small" style={styles.loader} />
        )}

        {detail?.hours?.length ? (
          <Text style={styles.hours}>{detail.hours[0]}</Text>
        ) : (
          <ActivityIndicator size="small" style={styles.loader} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    paddingBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  info: {
    padding: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#777',
    marginVertical: 4,
  },
  phone: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  hours: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  loader: {
    marginTop: 6,
  },
});

export default SwipeCard;