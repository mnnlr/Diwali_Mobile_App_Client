import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import img1 from '../assets/Our-Products.jpg';
import Man1 from '../assets/Man/man1.jpg'
import Man2 from '../assets/Man/man1.jpg'
import Wom from '../assets/girl/women.jpg'
import wom2 from '../assets/girl/women2.jpg'
export default function About() {
  return (
    <View style={styles.container}>
      <Image source={img1} style={styles.banner} />
      <View>
<Text style={styles.headerText}>Who we are</Text>
<Text style={styles.paragraph}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
      </View>
      <Text style={styles.headerText}>Our Team</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.cardContainer}>
          <Image source={Man1} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Yash</Text>
        </View>
        <View style={styles.cardContainer}>
          <Image source={Man2} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Mahesh</Text>
        </View>
        <View style={styles.cardContainer}>
          <Image source={Wom} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Prathibha</Text>
        </View>
         <View style={styles.cardContainer}>
          <Image source={wom2} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Sadna</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  banner: {
    width: '100%',
    height: 200, 
    resizeMode: 'cover',
  },
  headerText: {
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
    paragraph: {
    margin: 10,
    fontSize: 16,
    lineHeight: 24,
   
    color: '#333',
  },
  cardContainer: {
    width: '40%', 
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});


