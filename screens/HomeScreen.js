import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SwipeCard from '../components/SwipeCard';
import { fetchNearbyRestaurants, fetchPlaceDetails } from '../utils/places';
import { getUserLocation } from '../utils/location';
import { useFilter } from '../context/FilterContext';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { filters } = useFilter();
  const { logout, user, isDemoMode } = useAuth();

  const handleLogout = () => {
    if (isDemoMode) {
      Alert.alert(
        "Demo Mode",
        "Authentication is temporarily disabled for testing purposes.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

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
          showActions={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Discover Restaurants</Text>
          {isDemoMode && (
            <View style={styles.demoTag}>
              <Text style={styles.demoText}>DEMO</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF5A5F" />
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  demoTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  demoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#856404',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 20,
    paddingBottom: 120,
  },
  cardContainer: {
    marginBottom: 4,
  },
});

export default HomeScreen;