import axios from 'axios';
import { GOOGLE_API_KEY } from '../config';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export const fetchNearbyRestaurants = async (lat, lng, filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: 2000,
        type: 'restaurant',
        keyword: filters.cuisine || '',
        minprice: filters.budget === '$' ? 0 : filters.budget === '$$' ? 1 : 2,
        maxprice: filters.budget === '$' ? 1 : filters.budget === '$$' ? 2 : 4,
        key: GOOGLE_API_KEY,
      },
    });

    const places = response.data.results.filter((place) => {
      const rating = parseFloat(place.rating || '0');
      const minRating = parseFloat(filters.rating || '4');
      return rating >= minRating;
    });

    const detailed = await Promise.all(
      places.slice(0, 20).map(async (place) => {
        const detail = await fetchPlaceDetails(place.place_id);
        return {
          id: place.place_id,
          name: place.name,
          rating: place.rating,
          address: place.vicinity,
          ...detail,
        };
      })
    );

    return detailed;
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    return [];
  }
};

export const fetchPlaceDetails = async (placeId) => {
  try {
    const res = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'formatted_phone_number,opening_hours,photos',
        key: GOOGLE_API_KEY,
      },
    });

    const result = res.data.result;
    const photoRef = result.photos?.[0]?.photo_reference;

    return {
      phone: result.formatted_phone_number || 'N/A',
      hours: result.opening_hours?.weekday_text || [],
      image: photoRef
        ? `${BASE_URL}/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
        : 'https://via.placeholder.com/400?text=No+Image',
    };
  } catch (e) {
    console.error('Error fetching place details:', e);
    return {
      phone: 'N/A',
      hours: [],
      image: 'https://via.placeholder.com/400?text=No+Image',
    };
  }
};