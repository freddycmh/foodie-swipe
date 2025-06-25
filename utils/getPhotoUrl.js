import { GOOGLE_API_KEY } from '../config';


const getPhotoUrl = (photoReference) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=GOOGLE_API_KEY`;
  };
  
export default getPhotoUrl;
  