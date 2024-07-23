import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Image } from 'react-native';
import img1 from '../assets/girl/women.jpg'; 
import axios from 'axios'
export default function ContactsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleContactSubmit = async () => {
    try{
      const res = await axios.post('http://192.168.0.106:3000/contact', {name, email, phone, message})
      if(res.data){
       alert("Send successfully")
      }else {
              
               alert('Login failed. Please try again later.');
            }
         }catch(err){
          console.log(err)
         }
          
       
   
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Image source={img1} style={styles.banner} />
        <Text style={styles.headerText}>Contact Us</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Message" 
          multiline={true} 
          numberOfLines={4} 
          value={message}
          onChangeText={setMessage}
        />
        
        <Button title="Submit" onPress={handleContactSubmit} color="black" />
      </View>
    </ScrollView>
  );
}

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
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

