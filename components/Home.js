import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from '../Redux/store'
import HomeScreen from '../Bottomtab/HomeScreen';
import ContactsScreen from '../Bottomtab/ContactsScreen';
import PagesScreen from '../Bottomtab/PagesScreen';
import ShopScreen from '../Bottomtab/ShopScreen';
import Cart from '../Bottomtab/Cart';
import ProductDetailsScreen from './ProductDetailsScreen';
import { CartProvider } from '../Contaxt/CartProvider';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenCategory from '../Bottomtab/MenCategory';
import WomenCategory from '../Bottomtab/WomenCategory';
import CrackerCategory from '../Bottomtab/CrackerCategory';
import BombCategory from '../Bottomtab/BombCategory';
import Billing from '../Pages/Billing';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Shops" options={{ headerShown: false }} component={ShopScreen} />
      <Stack.Screen name="ProductDetails" options={{ headerShown: false }} component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}
function HomeScreenStack(){
  return(
    <Stack.Navigator  initialRouteName="Homescreen">
      <Stack.Screen name="Homescreen" options={{ headerShown: false }} component={HomeScreen}/>
<Stack.Screen name = 'MenCategory'options={{ headerShown: false }} component={MenCategory}/>
<Stack.Screen name = 'WomenCategory'options={{ headerShown: false }} component={WomenCategory}/>
<Stack.Screen name = 'CrackerCategory' options={{ headerShown: false }} component={CrackerCategory}/>
<Stack.Screen name = 'BombCategory' options={{ headerShown: false }} component={BombCategory}/>
<Stack.Screen name="ProductDetails" options={{ headerShown: false }} component={ProductDetailsScreen} />
    </Stack.Navigator>
  )
}
function CartStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="CartScreen" options={{ headerShown: false }} component={Cart} />
<Stack.Screen name = 'Bill'  options={{ headerShown: false }} component={Billing}/>
    </Stack.Navigator>
  )
}
export default function Home() {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
       
          <Tab.Navigator
          
            screenOptions={({ route }) => ({
              lazy: true,
    unmountOnBlur: true,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Shop') {
                  iconName = focused ? 'basket' : 'basket-outline';
                } else if (route.name === 'Pages') {
                  iconName = focused ? 'document' : 'document-outline';
                } else if (route.name === 'Contacts') {
                  iconName = focused ? 'person' : 'person-outline';
                } else if (route.name === 'Cart') {
                  iconName = focused ? 'cart' : 'cart-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                display: 'flex',
              },
            })}
          >
            <Tab.Screen name="Home" options={{ headerShown: false }} component={HomeScreenStack} />
            <Tab.Screen name="Shop" options={{ headerShown: false }} component={ShopStack} />
            <Tab.Screen name="Cart" options={{ headerShown: false }} component={CartStack} />
            <Tab.Screen name="Pages" options={{ headerShown: false }} component={PagesScreen} />
            <Tab.Screen name="Contacts" options={{ headerShown: false }} component={ContactsScreen} />
          </Tab.Navigator>
       
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
