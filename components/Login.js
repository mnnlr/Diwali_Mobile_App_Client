import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultAxios } from '../CustomAxios/DefaultAxios';
import axios from 'axios'


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try{

      const res = await defaultAxios.post('/login', {email, password})

      if(res.data){
         await AsyncStorage.setItem('token', JSON.stringify(res.data))
         console.log(res.data)
         navigation.navigate('Diwali Shoping');

      }else {
              
               alert('Login failed. Please try again later.');
            }


         }catch(err){
          console.log(err)
         }
          
       
         
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Login</Text>
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerButton}>Register</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  registerContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    marginRight: 5,
  },
  registerButton: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
