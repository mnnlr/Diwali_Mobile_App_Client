import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { TextInput, Button, Title, Text, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
const categories = {
  Men: [
    { _id: '666fc09b12e5fabc25ba8ebd', name: 'Baby Boy' },
    { _id: '66726b38fe24daa1842a5348', name: 'Boy' },
    { _id: '667178b4ac3bbd7c58c3e97e', name: 'Men' },

  ],
  Women: [
    { _id: '66726b2ac9573eac11e9c92c', name: 'Baby Girl' },
    { _id: '66726b38fe24daa1842a5348', name: 'Girl' },
    { _id: '667268ff1cad1ccc0a61e702', name: 'Women' },
    
  ],
};

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const patterns = ['Solid', 'Printed', 'Striped', 'Checked', 'Other'];

export default function ClothingForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    images: [],
    gender: 'Men',
    category: '',
    ageRange: {
      min: '',
      max: '',
    },
    age : '',
    attributes: {
      Fabric: '',
      Type: '',
      SalesPackage: '',
      StyleCode: '',
      TopFabric: '',
      BottomFabric: '',
      TopType: '',
      BottomType: '',
      Pattern: '',
      Color: '',
      Occasion: '',
      Neck: '',
      FabricCare: '',
      Size: '',
    },
  });
  const handleAgeChange = (age) => {
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      age: age,
    }));
  };
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const setAgeRange = (categoryId) => {
    const category = categories[formData.gender].find(cat => cat._id === categoryId);
    if (category) {
      if (category.name.includes('Baby')) {
        handleChange('ageRange', { min: '0', max: '5' });
      } else if (category.name === 'Boy' || category.name === 'Girl') {
        handleChange('ageRange', { min: '5', max: '18' });
      } else {
        handleChange('ageRange', { min: '18', max: '45' });
      }
    }
  };

  const handleChange = (name, value) => {
    if (name === 'category') {
      setAgeRange(value);
    }
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      attributes: {
        ...prevState.attributes,
        Type: value,
      },
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, result.assets[0].uri],
      }));
    }
  };

  const handleSubmit = () => {
    console.log(formData);
    // Here you would typically send the data to your backend
  };

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'input':
        return (
          <TextInput
            label={item.label}
            value={item.value}
            onChangeText={(text) => handleChange(item.name, text)}
            multiline={item.multiline}
            numberOfLines={item.numberOfLines}
            keyboardType={item.keyboardType}
            style={styles.input}
          />
        );
      case 'gender':
        return (
          <View style={styles.sectionContainer}>
            <Title style={styles.sectionTitle}>Gender</Title>
            <Divider style={styles.divider} />
            <View style={styles.segmentedButtonContainer}>
              <Button
                mode={formData.gender === 'Men' ? 'contained' : 'outlined'}
                onPress={() => handleChange('gender', 'Men')}
                style={[styles.segmentedButton, formData.gender === 'Men' ? styles.selectedButton : null]}
              >
                Male
              </Button>
              <Button
                mode={formData.gender === 'Women' ? 'contained' : 'outlined'}
                onPress={() => handleChange('gender', 'Women')}
                style={[styles.segmentedButton, formData.gender === 'Women' ? styles.selectedButton : null]}
              >
                Female
              </Button>
            </View>
          </View>
        );
      case 'category':
        return (
          <View style={styles.sectionContainer}>
            <Title style={styles.sectionTitle}>Category</Title>
            <Divider style={styles.divider} />
            <Picker
              selectedValue={formData.category}
              onValueChange={(itemValue) => handleChange('category', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a category" value="" />
              {categories[formData.gender].map((category) => (
                <Picker.Item key={category._id} label={category.name} value={category._id} />
              ))}
            </Picker>
          </View>
        );
        case 'ageRange':
          return (
            <View style={styles.sectionContainer}>
              <Title style={styles.sectionTitle}>Age Range</Title>
              <Divider style={styles.divider} />
              <View style={styles.ageRangeContainer}>
              
               
                <Text>Enter age from {formData.ageRange.min} to {formData.ageRange.max}</Text>
                <TextInput keyboardType='numeric' onChangeText={handleAgeChange}
          value={formData.age.toString()}/>
                <Text>Current Age : {formData.age}</Text>
              </View>
            </View>
          );
      case 'images':
        return (
          <View style={styles.sectionContainer}>
            <Title style={styles.sectionTitle}>Images</Title>
            <Divider style={styles.divider} />
            <Button mode="outlined" onPress={pickImage} style={styles.button}>
              Pick an image
            </Button>
            <View style={styles.imageContainer}>
              {formData.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.image} />
              ))}
            </View>
          </View>
        );
      case 'attributes':
        return (
          <View style={styles.sectionContainer}>
            <Title style={styles.sectionTitle}>Attributes</Title>
            <Divider style={styles.divider} />
            <Picker
              selectedValue={formData.attributes.Type}
              onValueChange={(itemValue) => handleTypeChange(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Set" value="Set" />
              <Picker.Item label="Top" value="Top" />
              <Picker.Item label="Bottom" value="Bottom" />
            </Picker>
            <Picker
              selectedValue={formData.attributes.Size}
              onValueChange={(itemValue) => handleChange('attributes.Size', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select size" value="" />
              {sizes.map((size, index) => (
                <Picker.Item key={index} label={size} value={size} />
              ))}
            </Picker>
            <Picker
              selectedValue={formData.attributes.Pattern}
              onValueChange={(itemValue) => handleChange('attributes.Pattern', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select pattern" value="" />
              {patterns.map((pattern, index) => (
                <Picker.Item key={index} label={pattern} value={pattern} />
              ))}
            </Picker>
            {formData.attributes.Type === 'Set' ? (
              <>
                <TextInput
                  label="Fabric"
                  value={formData.attributes.Fabric}
                  onChangeText={(text) => handleChange('attributes.Fabric', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Sales Package"
                  value={formData.attributes.SalesPackage}
                  onChangeText={(text) => handleChange('attributes.SalesPackage', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Style Code"
                  value={formData.attributes.StyleCode}
                  onChangeText={(text) => handleChange('attributes.StyleCode', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Top fabric"
                  value={formData.attributes.TopFabric}
                  onChangeText={(text) => handleChange('attributes.TopFabric', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Bottom fabric"
                  value={formData.attributes.BottomFabric}
                  onChangeText={(text) => handleChange('attributes.BottomFabric', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Top type"
                  value={formData.attributes.TopType}
                  onChangeText={(text) => handleChange('attributes.TopType', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Bottom type"
                  value={formData.attributes.BottomType}
                  onChangeText={(text) => handleChange('attributes.BottomType', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Color"
                  value={formData.attributes.Color}
                  onChangeText={(text) => handleChange('attributes.Color', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Occasion"
                  value={formData.attributes.Occasion}
                  onChangeText={(text) => handleChange('attributes.Occasion', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Neck"
                  value={formData.attributes.Neck}
                  onChangeText={(text) => handleChange('attributes.Neck', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Fabric care"
                  value={formData.attributes.FabricCare}
                  onChangeText={(text) => handleChange('attributes.FabricCare', text)}
                  style={styles.input}
                />
              </>
            ) : (
              <>
                <TextInput
                  label="Fabric"
                  value={formData.attributes.Fabric}
                  onChangeText={(text) => handleChange('attributes.Fabric', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Sales Package"
                  value={formData.attributes.SalesPackage}
                  onChangeText={(text) => handleChange('attributes.SalesPackage', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Color"
                  value={formData.attributes.Color}
                  onChangeText={(text) => handleChange('attributes.Color', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Occasion"
                  value={formData.attributes.Occasion}
                  onChangeText={(text) => handleChange('attributes.Occasion', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Fabric care"
                  value={formData.attributes.FabricCare}
                  onChangeText={(text) => handleChange('attributes.FabricCare', text)}
                  style={styles.input}
                />
              </>
            )}
          </View>
        );
      case 'submit':
        return (
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            Submit
          </Button>
        );
      default:
        return null;
    }
  };

  const formItems = [
    { type: 'input', label: 'Name', name: 'name', value: formData.name },
    { type: 'input', label: 'Description', name: 'description', value: formData.description, multiline: true, numberOfLines: 4 },
    { type: 'input', label: 'Price', name: 'price', value: formData.price, keyboardType: 'numeric' },
    { type: 'input', label: 'Stock Quantity', name: 'stockQuantity', value: formData.stockQuantity, keyboardType: 'numeric' },
    { type: 'gender' },
    { type: 'category' },
    { type: 'ageRange' },
    { type: 'images' },
    { type: 'attributes' },
    { type: 'submit' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={formItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: 10,
  },
  segmentedButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segmentedButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  
  selectedButton: {
    backgroundColor: 'black',
  },
  button: {
    marginVertical: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
  },
});