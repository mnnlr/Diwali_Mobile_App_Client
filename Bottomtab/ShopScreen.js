import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { addToCart, addToWatch } from '../Redux/action';
import { defaultAxios } from '../CustomAxios/DefaultAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper';
const { height } = Dimensions.get('window');

function ShopScreen({ navigation }) {
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.add);
  const [selectedSection, setSelectedSection] = useState('Men');
  const [pajama, setPajama] = useState([]);
  const [sherwani, setSherwani] = useState([]);
  const [lengha, setLengha] = useState([]);
  const [saree, setSaree] = useState([]);
  const [ethnicSets, setEthnicSets] = useState([]);
  const [kurti, setKurti] = useState([]);
  const [other, setOther] = useState([]);
  const [userData, setUserData] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [boys, setBoys] = useState([]);
  const [girls, setGirls] = useState([]);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue !== null) {
        setUserData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage', e);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const pajamaRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Men", "Clothing", "Pajama"] } });
      const sherwaniRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Men", "Clothing", "Sets", "Sherwani"] } });
      const sareeRes = await defaultAxios.get("/clothing", { params: { categoryName: ['Clothing', 'Ethnic', 'Women', 'Saree'] } });
      const kurtiRes = await defaultAxios.get("/clothing", { params: { categoryName: ['Clothing','Ethnic','Women',"Girl",'Kurta&Kurtis'] } });
      const ethnicSetsRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Men", "Clothing", "Sets", "Ethnic Sets"] } });
      const lenghaRes = await defaultAxios.get("/clothing", { params: { categoryName: ['Clothing','Ethnic','Women',"Girl",'Lehnga Choli'] } });
const boysRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Kids", "Boy", "Clothing","Sets","Ethnic Sets"] } });
const girlsRes = await defaultAxios.get("/clothing", { params: { categoryName: ["Ethnic", "Kids", "Girl", "Clothing","Sets","Ethnic Sets"]}})
      setPajama(pajamaRes.data.Data);
      setSherwani(sherwaniRes.data.Data);
      setSaree(sareeRes.data.Data);
      setKurti(kurtiRes.data.Data);
      setEthnicSets(ethnicSetsRes.data.Data);
      setLengha(lenghaRes.data.Data);
      setBoys(boysRes.data.Data);
      setGirls(girlsRes.data.Data);
     
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
    fetchData();
  }, []);

  const handleAddToCart = async (item) => {
    if (!userData) {
      Alert.alert('Login Required', 'Please login to add items to cart.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    if (item.stockQuantity === 0) {
     alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    try {
      const response = await defaultAxios.post('/cart', {}, {
        params: { id: item._id, quantity: 1 },
      
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
      console.error('Error:', err);
      Alert.alert('Error', 'An error occurred while adding to cart.');
    }
  };

  const handleAddToWatchlist = async (item) => {
    if (!userData) {
      Alert.alert('Login Required', 'Please login to add items to watchlist.', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
      return;
    }

    try {
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
      console.error('Error:', err);
      Alert.alert('Error', 'An error occurred while adding to watchlist.');
    }
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };
  const MemoizedItem = React.memo(({ item, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
              <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>Price: {item.price}</Text>
                <Text style={styles.cardPrice}>Quantity: {item.stockQuantity}</Text>
              </View>
              <View style={styles.cardButtonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(item)}>
                  <MaterialIcons name="add-shopping-cart" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleAddToWatchlist(item)}>
                  <MaterialIcons name="playlist-add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
    </TouchableOpacity>
  ));
  const renderData = () => {
    let data = [];
    switch (selectedFilter) {
      case 'Pajama':
        data = pajama;
        break;
      case 'Sherwani':
        data = sherwani;
        break;
      case 'Lengha':
        data = lengha;
        break;
      case 'Saree':
        data = saree;
        break;
      case 'Kurti':
        data = kurti;
        break;
      case 'Ethnic Sets':
        data = ethnicSets;
        break;
      case 'Boys':
        data = boys;
        break;
      case 'Girls':
        data = girls;
        break;
      default:
        data = other.concat(pajama).concat(sherwani).concat(lengha).concat(saree).concat(kurti).concat(ethnicSets);
        break;
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleProductPress(item)}>
            <MemoizedItem key={item.id} item={item} onPress={() => handleProductPress(item)} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setModalVisible(false);
  };

  const renderFilterOptions = () => (
    <View style={[styles.modalContent, { backgroundColor: 'white' }]}>
      <View style={styles.leftSection}>
        <ScrollView>
          <TouchableOpacity onPress={() => setSelectedSection('Men')} style={styles.sectionButton}>
          <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/shirt/5/h/o/xxl-sk04-macsivo-original-imahfk7ahe2s85w3.jpeg?q=70&crop=false'}} />
            <Text style={[styles.sectionButtonText, selectedSection === 'Men' && styles.selectedSectionButtonText]}>Men</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedSection('Women')} style={styles.sectionButton}>
          <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/ethnic-set/5/c/i/xl-zg-a01-b-ks-zoya-gaarments-original-imaguwcfhjhpr9mh.jpeg?q=70&crop=false'}} />
            <Text style={[styles.sectionButtonText, selectedSection === 'Women' && styles.selectedSectionButtonText]}>Women</Text>
          </TouchableOpacity>
         
          <TouchableOpacity onPress={() => setSelectedSection('Crackers')} style={styles.sectionButton}>
          <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/kuwzssw0/plant-seed/s/3/z/5-b09hhgmg7b-sow-and-grow-original-imag7wvvybxq5zzb.jpeg?q=70&crop=false'}} />
            <Text style={[styles.sectionButtonText, selectedSection === 'Crackers' && styles.selectedSectionButtonText]}>Crackers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedSection('Kids')} style={styles.sectionButton}>
          <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/kids-apparel-combo/e/k/w/12-13-years-heec01-heydals-original-imagyj7hbfdazcv6.jpeg?q=70&crop=false'}} />
            <Text style={[styles.sectionButtonText, selectedSection === 'Kids' && styles.selectedSectionButtonText]}>Kids</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.rightSection}>
        <ScrollView>
          {selectedSection === 'Men' && (
            <>
              <Text style={styles.modalTitle}>Men</Text>
              <TouchableOpacity onPress={() => handleFilterChange('Pajama')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/pyjama/w/s/z/xxl-py1002-slmnav-damensch-original-imagz5yzkky8t58g.jpeg?q=70&crop=false'}} />
                <Text>Pajama</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterChange('Sherwani')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/shopsy-sherwani/s/c/n/xl-s-42-shubhvivah-original-imagtfvw89bsh4yw.jpeg?q=70&crop=false'}} />
                <Text>Sherwani</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterChange('Ethnic Sets')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/kurta/h/9/x/l-fk-lm-og-kurta-19-lookmark-original-imahykkzdwcqyeg3.jpeg?q=70&crop=false'}} />
                <Text>Ethnic Sets</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedSection === 'Women' && (
            <>
              <Text style={styles.modalTitle}>Women</Text>
              <TouchableOpacity onPress={() => handleFilterChange('Saree')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/sari/0/h/4/free-ac-qr-84-prachi-looknchoice-unstitched-original-imahfczzanw6ypcw.jpeg?q=70&crop=false'}} />
                <Text>Saree</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterChange('Lengha')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/lehenga-choli/l/p/q/free-sleeveless-lihaaz-purvaja-original-imagqapj3taqfgzr.jpeg?q=70&crop=false'}} />
                <Text>Lengha</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterChange('Kurti')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/kurta/e/u/q/s-trishul-01-sanvi-fashion-original-imahfu37uued6bcg.jpeg?q=70&crop=false'}} />
                <Text>Kurti</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedSection === 'Crackers' && (
            <>
              <Text style={styles.modalTitle}>Crackers</Text>
              <TouchableOpacity onPress={() => handleFilterChange('Bomb')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/kuof5ow0/chocolate/4/n/f/24-diwali-chocolate-crackers-gift-box-chocolate-bomb-set-of-original-imag7qzprsn23jgb.jpeg?q=70&crop=false'}} />
                <Text>Bomb</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterChange('Fuljari')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://www.shutterstock.com/image-photo/man-holding-hand-charki-firework-260nw-1419677747.jpg'}} />
                <Text>Fuljari</Text>
              </TouchableOpacity>
            </>
          )}
          {selectedSection === 'Kids' && (
            <>
              <Text style={styles.modalTitle}>Kids</Text>
              <TouchableOpacity onPress={() => handleFilterChange('Boys')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/kurta/p/h/o/12-13-years-kids-kurta-tammu-original-imahymwcxq5zc7ff.jpeg?q=70&crop=false'}} />
                <Text>Boys</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterChange('Girls')} style={styles.modalButton}>
              <Avatar.Image size={44} source={{uri : 'https://rukminim2.flixcart.com/image/128/128/xif0q/kids-dress/a/r/s/8-9-years-group27-miss-chief-original-imahfv4dahzg6x7f.jpeg?q=70&crop=false'}} />
                <Text>Girls</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {renderData()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {renderFilterOptions()}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: '#f9f9f9',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    height: 40,
    borderColor: 'gray',
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
  cardImage: {
    width: 120,
    height: 140,
    borderRadius: 10,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  cardButtonContainer: {
    flexDirection: 'column',
    marginBottom: 6,
  },
  scrollContainer: {
    padding: 10,
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexDirection: 'row',
    flex: 1,
  },
  leftSection: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    paddingVertical: 8,
  },
  sectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 1,
  },
  sectionButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSectionButtonText: {
    fontWeight: 'bold',
  },
  rightSection: {
    width: '70%',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalButton: {
    paddingVertical: 12,
    
  },
});

export default ShopScreen;
