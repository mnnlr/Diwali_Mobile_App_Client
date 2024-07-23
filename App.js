import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import Admin from './Bottomtab/Admin';
import Login from './components/Login';
import { Provider } from 'react-redux';
import store from './Redux/store'
import { Modal } from 'react-native';
import Register from './components/Register';
import Home from './components/Home';
import AdminRegister from './components/AdminLogin';
import Profile from './components/Profile'
const Stack = createStackNavigator();

const App = () => {
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Provider store = {store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Diwali Shoping">
      <Stack.Screen
    name="Diwali Shoping"
    component={Home}
    options={({ navigation }) => ({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.headerRightIcon}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Login');
                  }}
                >
                  <Text style={styles.modalItem}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Watchlist');
                  }}
                >
                  <Text style={styles.modalItem}>Watchlist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('AdminRegister');
                  }}
                >
                  <Text style={styles.modalItem}>Admin</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      ),
    })}
  />
        <Stack.Screen name="Login"  component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="AdminRegister" component={AdminRegister} />
        <Stack.Screen name="Watchlist" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
 
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerRightIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modalItem: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
  },
});

export default App;
