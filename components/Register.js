import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card,IconButton } from 'react-native-paper';
import axios from 'axios'
import { defaultAxios } from '../CustomAxios/DefaultAxios';
const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [name, setname] = useState('')
const [showPassword, setShowPassword] = useState(false);
  const handleRegister = async () => {
   try{
const res = await defaultAxios.post('/register', {name, email, password})
if(res.data){
  navigation.navigate('Login');
}else {
        
         alert('Registration failed. Please try again later.');
      }
   }catch(err){
    console.log(err)
   }
    
    alert('Registration successful');
    navigation.navigate('Login');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Register</Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={text => setname(text)}
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
        <View style={styles.passwordContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <IconButton
              icon={showPassword ? "eye-off" : "eye"}
              size={20}
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}
            />
          </View>
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 0,
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

export default Register;
