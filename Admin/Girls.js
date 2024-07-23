import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, Button, Alert, Modal, Image } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { defaultAxios } from '../CustomAxios/DefaultAxios';
function Girls() {
 
const [girlsData, setGirlsData] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProductData, setNewProductData] = useState({
    title: '',
    price: '',
    image: null,
    q: ''
  });
  const [editedData, setEditedData] = useState(null);
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

  const fetchData = async () => {
    try {
     if(userData.userId ===null){
      console.log("userdata null")
     }
console.log(userData.userId)
      const response = await defaultAxios.post('/girl-data', {seller : userData?.userId});
      if (response.status === 200) {
        setGirlsData(response.data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {

    if(userData?.userId){
      fetchData();
    }
    getUserData();
   
  }, [userData?.userId]);
  
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access camera roll is required!');
      }
    })();
  }, []);
  const handleUpdateProduct = async () => {
    if (!editingProduct || !editedData) return;
  
    try {
      const payload = {
        id: editingProduct._id,
        price: editedData.price,
        q: editedData.q,
      };
  
      const response = await axios.put('http://192.168.0.106:3000/girl', payload);
  
      if (response.status === 200) {
        // Update the local state with the updated product
        const updatedProducts = girlsData.map((product) =>
          product._id === editingProduct._id ? { ...product, price: editedData.price, q: editedData.q } : product
        );
        setGirlsData(updatedProducts);
  
        Alert.alert('Success', 'Product updated successfully');
        setEditingProduct(null);
        setEditedData(null);
      } else {
        Alert.alert('Error', 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'An error occurred while updating the product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      console.log(productId);
      const res = await axios.delete('http://192.168.0.106:3000/girl', {
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
    setEditingProduct(product);
    setEditedData({
      title: product.title,
      price: product.price.toString(),
      image: product.image,
      q: product.q.toString(),
    });
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newProductData.title);
      formData.append('price', newProductData.price);
      formData.append('q', newProductData.q);
      const fileName = newProductData.image.uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      // Ensure newProductData.image.uri is the correct URI of the image
      formData.append('image', {
        uri: newProductData.image.uri,
        type: `image/${fileType}`,
        name: `${newProductData.title.replace(/\s+/g, '')}.${fileType}`, 
      });
  
      const response = await axios.post('http://192.168.0.106:3000/girl', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data) {
        // Fetch data again to update the list with the new product
        fetchData();
  
        Alert.alert('Success', 'New product added successfully');
        setModalVisible(false);
        setNewProductData({
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
        setNewProductData({ ...newProductData, image: { uri: selectedImageUri } });
      } else {
        console.log('Image picker canceled or no URI:', pickerResult);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  useEffect(() => {
    console.log('New Product Data:', newProductData); 
  }, [newProductData]);

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
              value={newProductData.title}
              onChangeText={(text) => setNewProductData({ ...newProductData, title: text })}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Price"
              value={newProductData.price}
              onChangeText={(text) => setNewProductData({ ...newProductData, price: text })}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <Button title="Select Image" onPress={handleSelectImage} />
            {newProductData.image && (
              <Image source={newProductData.image} style={styles.imagePreview} />
            )}
            <TextInput
              placeholder="Quantity"
              value={newProductData.q}
              onChangeText={(text) => setNewProductData({ ...newProductData, q: text })}
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
      {girlsData.map((product) => (
        <Card key={product._id} style={styles.card}>
      <Card.Cover source={{ uri: product.image }} />
          <Card.Content>
            <Title>
              {editingProduct === product ? (
                <TextInput
                  value={editedData ? editedData.title : product.title}
                  onChangeText={(text) => setEditedData({ ...editedData, title: text })}
                  style={styles.input}
                  editable
                />
              ) : (
                product.title
              )}
            </Title>
            <View>
              <Text>Price: $</Text>
              {editingProduct === product ? (
                <TextInput
                  value={editedData ? editedData.price : product.price.toString()}
                  onChangeText={(text) => setEditedData({ ...editedData, price: text })}
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
              {editingProduct === product ? (
                <TextInput
                  value={editedData ? editedData.q : product.q.toString()}
                  onChangeText={(text) => setEditedData({ ...editedData, q: text })}
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
            {editingProduct === product ? (
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
  card: {
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
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default Girls;
