import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Billing from '../Pages/Billing'
import About from '../Pages/About'
import { StripeProvider } from '@stripe/stripe-react-native';
export default function PageScreen() {
  const [selectedFilter, setSelectedFilter] = useState('about');

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const renderData = () => {
    switch (selectedFilter) {
      case 'about':
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <About/>
          </ScrollView>
        );
      case 'bill':
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
             <StripeProvider publishableKey="pk_test_51PQkIBFHEvSwKEHyg3ecMRIUjrvAx4OZyLXOvshix3U1JVnZpcOgxNSZ9IzjfacuiqT8nX0qUaDCvvlv40DwqPMY00sU8ETp1x"> 
      <Billing />
    </StripeProvider>
          </ScrollView>
        );
      default:
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text>About</Text>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
      <Text
          style={[styles.filterButton, selectedFilter === 'about' && styles.activeFilter]}
          onPress={() => handleFilterChange('about')}
        >
          About
        </Text>
        <Text
          style={[styles.filterButton, selectedFilter === 'bill' && styles.activeFilter]}
          onPress={() => handleFilterChange('bill')}
        >
          Bill
        </Text>
        
      </View>
      {renderData()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: 'tomato',
    color: 'white',
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

