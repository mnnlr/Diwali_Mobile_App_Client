import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeToWatch } from '../Redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { privateAxios } from '../CustomAxios/DefaultAxios';
import { Card, Button, Title, Paragraph } from 'react-native-paper';

export default function Profile() {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [watch, setWatch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (userData) {
      fetchData();
    }
  }, [userData]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await privateAxios.get('/wishlist', {
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
        },
      });
      if (response.data) {
        setWatch(response.data.Data.products);
      }
    } catch (error) {
      console.log('Error fetching watchlist:', error);
      setError('Failed to fetch watchlist data');
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (item) => {
    setIsLoading(true);
    try {
      const response = await privateAxios.delete('/wishlist', {
        params: {  productId: item.productId._id
           },
        headers: {
          'Authorization': `Bearer ${userData.Data.token}`,
        
        },
        
      });
      fetchData()
    } catch (error) {
      console.log('Error removing item from watchlist:', error);
      setError('Failed to remove item from watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView>
          {watch.length > 0 ? (
            <View style={styles.watchlistContainer}>
              {watch.map((item) => (
                <Card key={item._id} style={styles.card}>
                  <Card.Cover source={{ uri: item.productId.images[0] }} />
                  <Card.Content>
                    <Title>{item.productId.name}</Title>
                    <Paragraph>Price: ${item.productId.price}</Paragraph>
                    <Paragraph>Quantity: {item.productId.stockQuantity}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                    <Button mode="contained" onPress={() => remove(item)}   buttonColor="tomato">
                      Remove
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No items in watchlist</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  watchlistContainer: {
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});
