import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share, Alert } from 'react-native';
import { addToCart, addToWatch } from '../Redux/action';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { defaultAxios, privateAxios } from '../CustomAxios/DefaultAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userData, setUserData] = useState('');

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

  const handleAddToCart = async (item) => {
    if (!userData) {
      alert('Login Required', 'Please login to add items to cart.', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
      return;
    }

    try {
      console.log('User Token:', userData.Data.token);
      console.log('Item ID:', item._id);

      const response = await defaultAxios.post('/cart', {}, {
        params: { id: item._id },
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(response.data.message);
        dispatch(addToCart(item));
      } else {
        console.error('Unexpected status code:', response.status);
        alert(`An unexpected error occurred: ${response.status}`);
      }
    } catch (err) {
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      alert(`An error occurred: ${err.message}`);
    }
  };

  const handleAddToWatchlist = async (item) => {
    if (!userData) {
      alert('Login Required', 'Please login to add items to watchlist.', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
      return;
    }

    try {
      console.log('User Token:', userData.Data.token);
      console.log('Item ID:', item._id);

      const response = await defaultAxios.put('/wishlist', {}, {
        params: { id: item._id },
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(response.data.message);
        dispatch(addToWatch(item));
      } else {
        console.error('Unexpected status code:', response.status);
        alert(`An unexpected error occurred: ${response.status}`);
      }
    } catch (err) {
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      alert(`An error occurred: ${err.message}`);
    }
  };

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleShare = async () => {
    try {
      const imageUrl = product.images[activeIndex]; 
      const message = `Check out this product: ${product.title} - ${product.description} Image : ${imageUrl}`;

      await Share.share({
        message: message,
        url: imageUrl,
        title: product.title,
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to share this product.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-outline" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {product.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="contain" />
          ))}
        </ScrollView>
        <View style={styles.pagination}>
          {product.images.map((_, index) => (
            <View key={index} style={[styles.dot, activeIndex === index ? styles.activeDot : styles.inactiveDot]} />
          ))}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>Price: {product.price}</Text>
        <Text style={styles.quantity}>Quantity: {product.stockQuantity}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(product)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleAddToWatchlist(product)}>
            <Text style={styles.buttonText}>Add to Watchlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: 'tomato',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: 'tomato',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: width,
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'tomato',
  },
  inactiveDot: {
    backgroundColor: '#cccccc',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  detailsContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    marginBottom: 10,
  },
  quantity: {
    fontSize: 18,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
