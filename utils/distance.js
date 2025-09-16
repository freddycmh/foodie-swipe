// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
};

// Get restaurant coordinates from Google Places API response
export const getRestaurantCoordinates = async (restaurant) => {
  try {
    // If we already have coordinates from the places API
    if (restaurant.geometry?.location) {
      return {
        latitude: restaurant.geometry.location.lat,
        longitude: restaurant.geometry.location.lng,
      };
    }

    // If we have place_id, we could fetch details, but for now return null
    return null;
  } catch (error) {
    console.error('Error getting restaurant coordinates:', error);
    return null;
  }
};