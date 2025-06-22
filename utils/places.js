import axios from 'axios';
import { GOOGLE_API_KEY } from '../config';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Fetch nearby restaurants using Place Search
export const fetchNearbyRestaurants = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        radius: 2000, // 2km radius
        type: 'restaurant',
        key: GOOGLE_API_KEY,
      },
    });

    const places = response.data.results;

    // Fetch extra details (phone, hours, photos) for each place
    const detailedPlaces = await Promise.all(
      places.slice(0, 15).map(async (place) => {
        const details = await fetchPlaceDetails(place.place_id);
        return {
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          ...details,
        };
      })
    );

    return detailedPlaces;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};

// Fetch place details (phone, hours, photos)
export const fetchPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'formatted_phone_number,opening_hours,photos',
        key: GOOGLE_API_KEY,
      },
    });

    const result = response.data.result;

    const phone = result.formatted_phone_number || 'N/A';
    const hours = result.opening_hours?.weekday_text || [];
    const photoRef = result.photos?.[0]?.photo_reference;

    const image = photoRef
      ? getPhotoUrl(photoRef)
      : 'https://via.placeholder.com/400?text=No+Image';

    return {
      phone,
      hours,
      image,
    };
  } catch (error) {
    console.error('Error fetching details:', error);
    return {
      phone: 'N/A',
      hours: [],
      image: 'https://via.placeholder.com/400?text=No+Image',
    };
  }
};

// Convert photo reference to image URL
export const getPhotoUrl = (photoReference) => {
  return `${BASE_URL}/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};