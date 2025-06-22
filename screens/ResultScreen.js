import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LikedContext } from '../context/LikedContext';

const ResultScreen = () => {
  const { liked } = useContext(LikedContext);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>{item.vicinity}</Text>
      <Text style={styles.details}>⭐ {item.rating || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Liked Restaurants</Text>
      <FlatList
        data={liked}
        keyExtractor={(item) => item.place_id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
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
    backgroundColor: '#fcefe9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
});

export default ResultScreen;