import { GOOGLE_API_KEY } from '../config';

const getPhotoUrl = (photoReference) => {
  if (!photoReference || !GOOGLE_API_KEY) {
    return 'https://via.placeholder.com/400x200/f5f5f5/999?text=🍽️';
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

export default getPhotoUrl;
  