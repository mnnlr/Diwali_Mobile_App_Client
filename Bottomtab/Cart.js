import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { removeFromCart, addToCart } from '../Redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { privateAxios } from '../CustomAxios/DefaultAxios';

const Cart = ({ navigation }) => {
  const cartData = useSelector((state) => state.add);
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [userData, setUserData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    getUserData();
  }, []);

  const fetchdata = async () => {
    setIsLoading(true);
    if (!userData?.Data?.token) return;
    try {
      const response = await privateAxios.get('/cart', {
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`
        }
      });

      if (response.status === 200) {
        dispatch(addToCart(response.data.Data.products));
        console.log(response.data.Data.products)
        setCart(response.data.Data.products.map(item => ({ ...item, quantity: item.quantity })));
      }
    } catch (err) {
      console.log('Error in fetching data', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchdata();
    }
  }, [userData]);

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += (item.productId.price || 0) * item.quantity;
    });
    setTotalPrice(total.toFixed(2));
  }, [cart]);

  const handleRemoveFromCart = async (item) => {
    try {
      const response = await privateAxios.delete('/cart', {
        params: { productId: item.productId._id },
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
        },
      });
      if (response.status === 200) {
        fetchdata();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleQuantityIncrease = async(item) => {
    try {
      const response = await privateAxios.put('/cart', {}, {
        params: { id: item.productId._id, quantity: item.quantity + 1 },
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
          'Content-Type': 'application/json'
        }
      });
      if(response.status === 200){
        const updatedCart = cart.map(cartItem => {
          if (cartItem._id === item._id) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          }
          return cartItem;
        });
        setCart(updatedCart);
      }
    } catch(err){
      console.log(err);
    }
  };

  const handleQuantityDecrease = async(item) => {
    try {
      const response = await privateAxios.put('/cart', {}, {
        params: { id: item.productId._id, quantity: item.quantity - 1 },
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
          'Content-Type': 'application/json'
        }
      });
      if(response.status === 200){
        const updatedCart = cart.map(cartItem => {
          if (cartItem._id === item._id && cartItem.quantity > 1) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          }
          return cartItem;
        });
        setCart(updatedCart);
      }
    } catch(err){
      console.log(err);
    }
  };
  const navigateToBill = () => {
    navigation.navigate('Bill');
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="tomato" />
      ) : (
        <ScrollView style={styles.scrollView}>
          {cart.length === 0 ? (
            <Text style={styles.noItemsText}>No items in the cart</Text>
          ) : (
            cart.map((item) => (
              <Card key={item._id} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <Image source={{ uri: item.productId.images[0] }} style={styles.image} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.productId.name}</Text>
                    <Text style={styles.itemPrice}>Price: ${item.productId.price}</Text>
                    <View style={styles.quantityControl}>
                      <Button mode="contained"
                           labelStyle={{ fontSize: 16 }} onPress={() => handleQuantityDecrease(item)} style={styles.quantityButton}>
                        -
                      </Button>
                      <Text style={styles.itemQuantity}>{item.quantity}</Text>
                      <Button mode="contained"
                           labelStyle={{ fontSize: 16 }} onPress={() => handleQuantityIncrease(item, 1)} style={styles.quantityButton}>
                        +
                      </Button>
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained"
                    onPress={() => handleRemoveFromCart(item)}
                    buttonColor="tomato"
                  >
                    Remove
                  </Button>
                </Card.Actions>
              </Card>
            ))
          )}
        </ScrollView>
      )}
      {cart.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${totalPrice}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={navigateToBill} style={styles.billButton}>
          Go to Bill
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  noItemsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
  },
  itemQuantity: {
    fontSize: 14,
    paddingHorizontal: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    minWidth: 30,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
      position: 'absolute',
    bottom: 1,
    left: 10,
    right: 10,
    width : 156
  },
  billButton: {
    backgroundColor: 'tomato',
  },
  quantityButton: {
    minWidth: 10,
    
    justifyContent: 'center',
    alignItems: 'center',
   
  },
});

export default Cart;
