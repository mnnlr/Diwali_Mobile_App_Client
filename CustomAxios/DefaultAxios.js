import axios from 'axios';

const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue != null) {
        setUserData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage', e);
    }
  };
const defaultAxios = axios.create({
    baseURL: 'https://diwali-e-commerce-backend-n2a2.onrender.com',
    headers: {
        'Content-Type': 'application/json',
        
    },
});


const privateAxios = axios.create({
    baseURL: 'https://diwali-e-commerce-backend-n2a2.onrender.com',
    headers: {
        'Content-Type': 'application/json',
       
    },
});
export { defaultAxios, privateAxios }