import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Alert,ActivityIndicator } from 'react-native';
import { defaultAxios } from '../CustomAxios/DefaultAxios';
import { Ionicons } from '@expo/vector-icons';

export default function MenCategory({ navigation }) {
  const [pajama, setPajama] = useState([]);
  const [sherwani, setSherwani] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const pajamaRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Men", "Clothing", "Pajama"] } });
      const sherwaniRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Men", "Clothing", "Sets", "Sherwani"] } });
     
      setPajama(pajamaRes.data.Data);
      setSherwani(sherwaniRes.data.Data);
      
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  const handleProductPress = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item)}>
    <Image
      style={styles.image}
      source={{ uri: item.images[0] }}
    />
    <View style={styles.cardContent}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.quantity}>Quantity: {item.stockQuantity}</Text>
    </View>
  </TouchableOpacity>
  );

  const addToCart = (item) => {
    // Implement logic to add item to cart
    Alert.alert('Add to Cart', `Added ${item.name} to cart.`);
  };

  const addToWatchlist = (item) => {
    // Implement logic to add item to watchlist
    Alert.alert('Add to Watchlist', `Added ${item.name} to watchlist.`);
  };

  // Filter data based on selected category
  const filteredData = selectedCategory === 'Pajama' ? pajama :
                        selectedCategory === 'Sherwani' ? sherwani :
                        [...pajama, ...sherwani];


                        if (loading) {
                          return (
                            <View style={styles.loadingContainer}>
                              <ActivityIndicator size="large" color="tomato" />
                            </View>
                          );
                        }
  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <TouchableOpacity onPress={() => handleCategoryChange('Pajama')} style={[styles.filterButton, selectedCategory === 'Pajama' && styles.selectedFilterButton]}>
          <Text>Pajama</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCategoryChange('Sherwani')} style={[styles.filterButton, selectedCategory === 'Sherwani' && styles.selectedFilterButton]}>
          <Text>Sherwani</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCategoryChange(null)} style={[styles.filterButton, selectedCategory === null && styles.selectedFilterButton]}>
          <Text>All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    height: 40,
    borderColor: 'gray',
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  selectedFilterButton: {
    backgroundColor: 'tomato',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    width: '45%', // Adjust as needed
    padding: 10,
    margin: '2.5%', // Adjust as needed
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  name: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'gray',
  },
  quantity: {
    fontSize: 14,
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'column',
    
    marginBottom: 5,
    marginHorizontal : 9
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'tomato',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});
