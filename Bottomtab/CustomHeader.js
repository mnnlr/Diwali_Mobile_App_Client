// CustomHeader.js
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomHeader({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>App Name</Text>
      <View style={{ width: 24 }} /> {/* Placeholder to balance the title */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
          <TouchableOpacity
  onPress={() => {
    setModalVisible(false);
    navigation.navigate('Admin');
  }}
>
  <Text>Admin</Text>
</TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
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
