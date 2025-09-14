import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
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
    const isExpanded = expandedItems[item.place_id || item.id];
    const address = item.address || item.vicinity;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/80?text=🍽️' }}
            style={styles.restaurantImage}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.rating || 'N/A'}</Text>
              <Text style={styles.ratingText}>
                {item.rating ? `${item.rating}/5.0` : 'No rating'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeIcon}>❌</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          {item.phone && item.phone !== 'N/A' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.callButton]}
              onPress={() => makePhoneCall(item.phone)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          )}

          {address && (
            <TouchableOpacity
              style={[styles.actionButton, styles.directionsButton]}
              onPress={() => openDirections(address)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🧭</Text>
              <Text style={styles.actionText}>Directions</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.expandButton]}
            onPress={() => toggleExpanded(item.place_id || item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>{isExpanded ? '📤' : '📥'}</Text>
            <Text style={styles.actionText}>{isExpanded ? 'Less' : 'More'}</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailText}>{address}</Text>
              </View>
            )}

            {item.phone && item.phone !== 'N/A' && (
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📱</Text>
                <Text style={styles.detailText}>{item.phone}</Text>
              </View>
            )}

            {item.hours && item.hours.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>🕒 Opening Hours</Text>
                {item.hours.slice(0, 3).map((hour, index) => (
                  <Text key={index} style={styles.hourText}>{hour}</Text>
                ))}
                {item.hours.length > 3 && (
                  <Text style={styles.moreHours}>
                    +{item.hours.length - 3} more days
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>No Liked Restaurants Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start swiping to discover and save your favorite restaurants!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5A5F" />

      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <Text style={styles.title}>❤️ Your Favorites</Text>
          <Text style={styles.subtitle}>
            {liked.length > 0 ? `${liked.length} saved restaurant${liked.length === 1 ? '' : 's'}` : 'No restaurants saved yet'}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingBottom: 0,
  },
  headerGradient: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#FF5A5F',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    marginTop: -20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f1f3f4',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff5f5',
  },
  removeIcon: {
    fontSize: 20,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  callButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  directionsButton: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  expandButton: {
    backgroundColor: '#f3e5f5',
    borderWidth: 1,
    borderColor: '#9c27b0',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    backgroundColor: '#fafbfc',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: '#495057',
    lineHeight: 20,
  },
  detailSection: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  hourText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    paddingLeft: 20,
  },
  moreHours: {
    fontSize: 14,
    color: '#9c27b0',
    fontStyle: 'italic',
    paddingLeft: 20,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ResultScreen;