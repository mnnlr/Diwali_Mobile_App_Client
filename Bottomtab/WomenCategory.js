import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { defaultAxios } from '../CustomAxios/DefaultAxios';
import { Ionicons } from '@expo/vector-icons';

export default function WomenCategory({ navigation }) {
  const [kurti, setKurti] = useState([]);
  const [saree, setSaree] = useState([]);
  const [lengha, setLengha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const kurtiRes = await defaultAxios.get("/clothing", { params: { categoryName: ['Clothing','Ethnic','Women',"Girl",'Kurta&Kurtis'] } });
      const sareeRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Women", "Clothing", "Saree"] } });
      const lenghaRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Women", "Clothing", "Lehnga Choli"] } });
     
      setKurti(kurtiRes.data.Data);
      setSaree(sareeRes.data.Data);
      setLengha(lenghaRes.data.Data);
      
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

  // Filter data based on selected category
  const filteredData = selectedCategory === 'Kurti' ? kurti :
                        selectedCategory === 'Saree' ? saree :
                        selectedCategory === 'Lehanga' ? lengha :
                        [...kurti, ...saree, ...lengha];

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
        <TouchableOpacity onPress={() => handleCategoryChange('Saree')} style={[styles.filterButton, selectedCategory === 'Saree' && styles.selectedFilterButton]}>
          <Text>Saree</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCategoryChange('Kurti')} style={[styles.filterButton, selectedCategory === 'Kurti' && styles.selectedFilterButton]}>
          <Text>Kurti</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCategoryChange('Lehanga')} style={[styles.filterButton, selectedCategory === 'Lehanga' && styles.selectedFilterButton]}>
          <Text>Lehanga</Text>
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
});
