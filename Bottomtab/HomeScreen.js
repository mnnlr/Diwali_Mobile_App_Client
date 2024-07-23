import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';
import topProducts from './topProducts';
import { ScrollView } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue !== null) {
        setUserData(JSON.parse(jsonValue));
        console.log(jsonValue);
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage', e);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  const renderTopProductItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() =>   navigation.navigate('ProductDetails', { product: item })}>
         <Card style={styles.cardContainer}>
        <Card.Cover source={{ uri: item.images[0] }} />
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>Price: ${item.price}</Paragraph>
          <Paragraph>Quantity: {item.stockQuantity}</Paragraph>
        </Card.Content>
      </Card>
  </TouchableOpacity>
  );
  const bannerData = [
    { id: 1, image: require('../assets/Hero-image.jpg'), title: 'Diwali Collection' },
    { id: 2, image: require('../assets/banner.png'), title: 'Diwali Collection' },
  ];

  const renderBanner = ({ item }) => (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={() => navigation.navigate('Shop')}>
      <Image source={item.image} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.shopNowButton}>
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const categoryData = [
    { id: 1, image: require('../assets/4feet-twinkling-stars.jpg'), title: 'Crackers Collection', navigation: 'CrackerCategory' },
    { id: 2, image: require('../assets/60-shots.jpg'), title: 'Bomb Collection', navigation: 'BombCategory' },
    { id: 3, image: require('../assets/Man/(1).jpg'), title: 'Men Collection', navigation: 'MenCategory' },
    { id: 4, image: require('../assets/girl/(4).jpg'), title: 'Women Collection', navigation: 'WomenCategory' },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryBox}
      onPress={() => navigation.navigate(item.navigation)}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
      <FlatList
        data={bannerData}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerFlatList}
      />

      <Text style={styles.sectionTitle}>Categories</Text>

      <FlatList
        data={categoryData}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        contentContainerStyle={styles.categoryContainer}
        showsHorizontalScrollIndicator={false}
      />
        <Text style={styles.sectionTitle}>Top Products</Text>

<FlatList
  data={topProducts}
  renderItem={renderTopProductItem}

  horizontal
  contentContainerStyle={styles.topProductContainerStyle}
  showsHorizontalScrollIndicator={false}
/>
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  topProductContainerStyle: {
    paddingHorizontal: 10,
  },
  card: {
    marginRight: 10, 
  },
  cardContainer: {

    width: 200, 
    marginBottom: 10, 
     height : 350,
     backgroundColor : 'white'
  },
  bannerContainer: {
    width: width - 20,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  shopNowButton: {
    backgroundColor: 'tomato',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 10,
  },
  categoryContainer: {
    paddingBottom: 10,
  },
  categoryBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 150,
    marginRight: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  bannerFlatList: {
    height:200,
  },
   topProductContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 250,
    marginRight: 10,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2, // Add elevation for shadow on Android
  },
  topProductImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  topProductDetails: {
    padding: 10,
    flex: 1,
  },
  topProductTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topProductPrice: {
    fontSize: 14,
    marginTop: 5,
  },
  topProductContainerStyle: {
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
