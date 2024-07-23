import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, useTheme, Card } from 'react-native-paper';

const AdminRegister = ({ navigation }) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [bankDetails, setBankDetails] = useState('');

  const handleRegister = () => {
    // Handle registration logic here
    console.log({
      name,
      email,
      password,
      businessAddress,
      bankDetails,
    });
    // Navigate to the Admin page after successful registration
    navigation.navigate('Admin');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={[styles.title, { color: theme.colors.primary }]}>Admin Register</Title>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          <TextInput
            label="Business Address"
            value={businessAddress}
            onChangeText={setBusinessAddress}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Bank Details"
            value={bankDetails}
            onChangeText={setBankDetails}
            style={styles.input}
            mode="outlined"
          />
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
    backgroundColor: '#fff',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default AdminRegister;
