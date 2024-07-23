import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { privateAxios } from '../CustomAxios/DefaultAxios';

const Billing = () => {
  const [cart, setCart] = useState([]);
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
        setCart(response.data.Data.products);
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

  const handlePlaceOrder = () => {
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Country:', country);
    console.log('Address:', address);
    console.log('City:', city);
    console.log('State:', state);
    console.log('Postcode:', postcode);
    console.log('Phone:', phone);
    console.log('Email:', email);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.productId.price * 1, 0); // Assuming quantity is 1
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Billing Details</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
          style={styles.inputFull}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={styles.inputFull}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.inputFull}
          placeholder="Town/City"
          value={city}
          onChangeText={setCity}
        />

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Country/State"
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={styles.input}
            placeholder="Postcode / ZIP"
            value={postcode}
            onChangeText={setPostcode}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="tomato" />
        ) : ( 
          <>
            <Text style={styles.headerText}>Your Order</Text>
            {cart.map((item, index) => (
              <View key={index} style={styles.orderSummary}>
                <Text>{truncateText(item.productId.name, 20)}</Text>
                <Text>${(item.productId.price * 1).toFixed(2)}</Text> 
              </View>
            ))}
            <View style={styles.orderSummary}>
              <Text style={styles.boldText}>Subtotal</Text>
              <Text style={styles.boldText}>${calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.orderSummary}>
              <Text style={styles.boldText}>Total</Text>
              <Text style={styles.boldText}>${calculateTotal().toFixed(2)}</Text>
            </View>

            <Button title="Place Order" onPress={handlePlaceOrder} color="tomato" />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 5,
    paddingHorizontal: 10,
  },
  inputFull: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default Billing;
