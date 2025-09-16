import axios from 'axios';
import { GOOGLE_API_KEY } from '../config';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Fetches up to 10 basic nearby restaurants based on filters.
 */
export const fetchNearbyRestaurants = async (lat, lng, filters = {}) => {
  try {
    let allPlaces = [];
    let nextPageToken = null;
    let fetchCount = 0;

    const baseParams = {
      location: `${lat},${lng}`,
      radius: filters.radius ? filters.radius * 1000 : 2000, // Convert km to meters, default 2km
      type: 'restaurant',
      keyword: filters.cuisine || '',
      minprice: filters.budget === '$' ? 0 : filters.budget === '$$' ? 1 : 2,
      maxprice: filters.budget === '$' ? 1 : filters.budget === '$$' ? 2 : 4,
      key: GOOGLE_API_KEY,
    };

    do {
      const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
        params: nextPageToken
          ? { pagetoken: nextPageToken, key: GOOGLE_API_KEY }
          : baseParams,
      });

      const results = response.data.results || [];
      allPlaces = [...allPlaces, ...results];

      nextPageToken = response.data.next_page_token;
      fetchCount++;

      if (nextPageToken) {
        await new Promise((res) => setTimeout(res, 2000));
      }
    } while (nextPageToken && fetchCount < 1); // Only first page to save API calls

    const minRating = parseFloat(filters.rating || '4');

    // Return only basic restaurant info - limited to 10
    return allPlaces
      .filter((place) => parseFloat(place.rating || '0') >= minRating)
      .slice(0, 10)
      .map((place) => ({
        id: place.place_id,
        name: place.name,
        rating: place.rating,
        address: place.vicinity,
        coordinates: place.geometry?.location ? {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        } : null,
      }));
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    return [];
  }
};

/**
 * Lazily fetches full detail for a given place_id.
 */
export const fetchPlaceDetails = async (placeId) => {
  try {
    const res = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'formatted_phone_number,opening_hours,photos,formatted_address',
        key: GOOGLE_API_KEY,
      },
    });

    const result = res.data.result;
    const photoRef = result.photos?.[0]?.photo_reference;

    return {
      phone: result.formatted_phone_number || 'N/A',
      hours: result.opening_hours?.weekday_text || [],
      address: result.formatted_address || null,
      image: photoRef
        ? `${BASE_URL}/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
        : 'https://via.placeholder.com/400?text=No+Image',
    };
  } catch (e) {
    console.error('Error fetching place details:', e);
    return {
      phone: 'N/A',
      hours: [],
      address: null,
      image: 'https://via.placeholder.com/400?text=No+Image',
    };
  }
};