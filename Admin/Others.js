import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, Button, Alert, Modal, Image } from 'react-native';
import { Card, Title, } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
function Others() {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token');
      if (jsonValue != null) {
        setUserData(JSON.parse(jsonValue));
        console.log(jsonValue)
     
      }
    } catch (e) {
      console.log('Failed to fetch the data from storage', e);
    }
  };

  useEffect(() => {
    getUserData();
   
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.post('http://192.168.0.106:3000/others-data', {seller :userData.userId });
      if (response.status === 200) {
        
        setProductsData(response.data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [productsData, setProductsData] = useState([]);
  const [editTargetProduct, setEditTargetProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNewProductData, setModalNewProductData] = useState({
    title: '',
    price: '',
    image: null,
    q: ''
  });
  const [editedProductData, setEditedProductData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access camera roll is required!');
      }
    })();
  }, []);

  const handleUpdateProduct = async() => {
    if (!editedProductData || !editTargetProduct) return;
  
    try {
      const payload = {
        id: editTargetProduct._id, 
        price: editedProductData.price,
        q: editedProductData.q,
      };
      console.log('Payload:', payload)
      if (!payload.id) {
        console.log('no id')
      }
      if (!payload.price) {
        console.log('no price')
      } 
      if (!payload.q) {
        console.log('no q')
      }
      const response = await axios.put('http://192.168.0.106:3000/others', payload);
  
      if (response.status === 200) {
        // Update the local state with the updated product
        const updatedProducts = productsData.map((product) =>
          product._id === editTargetProduct._id ? { ...product, price: payload.price, q: payload.q } : product
        );
        setProductsData(updatedProducts);
  
        Alert.alert('Success', 'Product updated successfully');
        setEditTargetProduct(null);
        setEditedProductData(null);
        fetchData()
      } else {
        Alert.alert('Error', 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'An error occurred while updating the product');
    }
  };

  const handleDeleteProduct = async(productId) => {
    try {
      console.log(productId);
      const res = await axios.delete('http://192.168.0.106:3000/other', {
        data: { id: productId } 
      });
      if (res.data) {
        alert("Deleted");
        fetchData()
      } else {
        alert('Unable to delete');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartEditingProduct = (product) => {
    setEditTargetProduct(product);
    setEditedProductData({
      title: product.title,
      price: product.price.toString(),
      image: product.image,
      q: product.q.toString(),
    });
  };

  const handleAddProduct =async () => {
    try {
      const formData = new FormData();
      formData.append('title', modalNewProductData.title);
      formData.append('price', modalNewProductData.price);
      formData.append('q', modalNewProductData.q);
      formData.append('image', {
        uri: modalNewProductData.image.uri,
        type: 'image/jpeg', 
        name: 'productImage.jpg', 
      });

      const response = await axios.post('http://192.168.0.106:3000/others', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        fetchData();
        setModalVisible(false);
        setModalNewProductData({
          title: '',
          price: '',
          image: null,
          q: '',
        });
      } else {
        Alert.alert('Error', 'Failed to add new product');
      }
    } catch (error) {
      console.error('Error adding new product:', error);
      Alert.alert('Error', 'An error occurred while adding the new product');
    }
  };

  const handleSelectImage = async () => {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedImageUri = pickerResult.assets[0].uri;
        console.log('Picker Result URI:', selectedImageUri); 
        setModalNewProductData({ ...modalNewProductData, image: { uri: selectedImageUri } });
      } else {
        console.log('Image picker canceled or no URI:', pickerResult);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  useEffect(() => {
    console.log('New Product Data:', modalNewProductData); 
  }, [modalNewProductData]);


  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Title"
              value={modalNewProductData.title}
              onChangeText={(text) => setModalNewProductData({ ...modalNewProductData, title: text })}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Price"
              value={modalNewProductData.price}
              onChangeText={(text) => setModalNewProductData({ ...modalNewProductData, price: text })}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <Button title="Select Image" onPress={handleSelectImage} />
            {modalNewProductData.image && (
              <Image source={modalNewProductData.image} style={styles.imagePreview} />
            )}
            <TextInput
              placeholder="Quantity"
              value={modalNewProductData.q}
              onChangeText={(text) => setModalNewProductData({ ...modalNewProductData, q: text })}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button title="Add" onPress={handleAddProduct} color="#4CAF50" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#F44336" />
            </View>
          </View>
        </View>
      </Modal>
      <Button title='Add New Product' onPress={() => setModalVisible(true)} style={styles.addButton} />
      {productsData.map((product) => (
        <Card key={product._id} style={styles.card}>
         <Card.Cover source={{ uri: product.image }} />
          <Card.Content>
            <Title>
              {editTargetProduct === product ? (
                <TextInput
                  value={editedProductData ? editedProductData.title : product.title}
                  onChangeText={(text) => setEditedProductData({ ...editedProductData, title: text })}
                  style={styles.input}
                  editable
                />
              ) : (
                product.title
              )}
            </Title>
            <View>
              <Text>Price: $</Text>
              {editTargetProduct === product ? (
                <TextInput
                  value={editedProductData ? editedProductData.price : product.price.toString()}
                  onChangeText={(text) => setEditedProductData({ ...editedProductData, price: text })}
                  style={styles.input}
                  keyboardType="numeric"
                  editable
                />
              ) : (
                <Text>{product.price}</Text>
              )}
            </View>
            <View>
              <Text>Quantity:</Text>
              {editTargetProduct === product ? (
                <TextInput
                  value={editedProductData ? editedProductData.q : product.q.toString()}
                  onChangeText={(text) => setEditedProductData({ ...editedProductData, q: text })}
                  style={styles.input}
                  keyboardType="numeric"
                  editable
                />
              ) : (
                <Text>{product.q}</Text>
              )}
            </View>
          </Card.Content>
          <Card.Actions>
            {editTargetProduct === product ? (
              <Button title='Change' onPress={handleUpdateProduct} color="#2196F3" />
            ) : (
              <>
                <Button title='Edit' onPress={() => handleStartEditingProduct(product)} color="#FF9800" />
                <Button title='Delete' onPress={() => handleDeleteProduct(product._id)} color="#F44336" />
              </>
            )}
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card:{
    marginVertical: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#2196F3", 
    color: "#fff", 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom : 100
  },
});

export default Others;

