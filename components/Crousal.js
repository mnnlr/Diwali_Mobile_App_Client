import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';

const Crousal = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      setCurrentIndex(nextIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * width,
          y: 0,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, items]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1}
        onScroll={(event) => {
          const { contentOffset } = event.nativeEvent;
          const index = Math.round(contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.carouselItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <TouchableOpacity style={styles.button} onPress={item.onPress}>
                <Text style={styles.buttonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItem: {
    width: Dimensions.get('window').width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 210,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
  },
});

export default Crousal;


