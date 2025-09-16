import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLiked } from '../context/LikedContext';

const { width: screenWidth } = Dimensions.get('window');

const ResultScreen = () => {
  const { liked, removeLiked } = useLiked();
  const [expandedItems, setExpandedItems] = useState({});

  const makePhoneCall = async (phone) => {
    if (!phone || phone === 'N/A') {
      Alert.alert('Phone Not Available', 'Sorry, we don\'t have the phone number for this restaurant.');
      return;
    }
    const cleanNumber = phone.replace(/[^\d+]/g, '');
    const phoneUrl = `tel:${cleanNumber}`;
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('Error', 'Unable to open phone application.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call.');
    }
  };

  const openDirections = async (address) => {
    if (!address) {
      Alert.alert('Address Not Available', 'Sorry, we don\'t have the address for this restaurant.');
      return;
    }
    const encodedAddress = encodeURIComponent(address);
    let url;
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${encodedAddress}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open maps application.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open directions.');
    }
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRemove = (item) => {
    Alert.alert(
      'Remove Restaurant',
      `Are you sure you want to remove "${item.name}" from your liked restaurants?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeLiked(item.place_id || item.id)
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const address = item.address || item.vicinity;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/400x200/f5f5f5/999?text=🍽️' }}
          style={styles.image}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.rating}>⭐ {item.rating || 'N/A'}</Text>
            {address && (
              <Text style={styles.address} numberOfLines={2}>{address}</Text>
            )}
          </View>

          <View style={styles.actions}>
            {item.phone && item.phone !== 'N/A' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => makePhoneCall(item.phone)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionText}>📞 Call</Text>
              </TouchableOpacity>
            )}

            {address && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openDirections(address)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionText}>🗺️ Directions</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🍽️</Text>
      <Text style={styles.emptyTitle}>No saved restaurants</Text>
      <Text style={styles.emptySubtitle}>
        Swipe right on restaurants you like to save them here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Restaurants</Text>
        <Text style={styles.subtitle}>{liked.length} places</Text>
      </View>

      {liked.length > 0 ? (
        <FlatList
          data={liked}
          keyExtractor={(item) => item.place_id || item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '400',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '400',
  },
  info: {
    marginBottom: 16,
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
  },
  address: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ResultScreen;