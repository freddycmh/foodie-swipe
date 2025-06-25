import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LikedContext } from '../context/LikedContext';

const ResultScreen = () => {
  const { liked } = useContext(LikedContext);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>{item.address || item.vicinity}</Text>
      <Text style={styles.info}>⭐ {item.rating || 'N/A'}</Text>
      <Text style={styles.info}>
        ☎ {item.phone !== 'N/A' ? item.phone : 'Phone not available'}
      </Text>
      {item.hours?.[0] && (
        <Text style={styles.info}>🕒 {item.hours[0]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Your Liked Restaurants</Text>
        <FlatList
          data={liked}
          keyExtractor={(item) => item.place_id || item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fdfcfb', // softer white
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#FF5A5F',
  },
  card: {
    backgroundColor: '#f8f4f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#eee',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});

export default ResultScreen;