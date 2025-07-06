import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFilter } from '../context/FilterContext';

const options = {
  cuisine: ['Any', 'Japanese', 'Mexican', 'Italian', 'Chinese', 'Thai', 'Indian', 'American'],
  budget: ['Any', '$', '$$', '$$$'],
  rating: ['Any', '3+', '4+', '4.5+'],
};

const FilterScreen = () => {
  const navigation = useNavigation();
  const { setFilters } = useFilter();

  const [selectedCuisine, setSelectedCuisine] = useState('Any');
  const [selectedBudget, setSelectedBudget] = useState('Any');
  const [selectedRating, setSelectedRating] = useState('Any');
  const [modalVisible, setModalVisible] = useState(null);

  const applyFilters = () => {
    setFilters({
      cuisine: selectedCuisine === 'Any' ? null : selectedCuisine.toLowerCase(),
      budget: selectedBudget === 'Any' ? null : selectedBudget,
      rating: selectedRating === 'Any' ? null : selectedRating.replace('+', ''),
    });
    navigation.navigate('Swipe');
  };

  const renderOptionGroup = (label, values, selectedValue, setter, key) => (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setModalVisible(key)}>
        <Text style={styles.selectorText}>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible === key} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {values.map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.modalOption}
                onPress={() => {
                  setter(value);
                  setModalVisible(null);
                }}
              >
                <Text style={styles.modalText}>
                  {value} {value === selectedValue ? '✅' : ''}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(null)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderOptionGroup('Cuisine', options.cuisine, selectedCuisine, setSelectedCuisine, 'cuisine')}
      {renderOptionGroup('Budget', options.budget, selectedBudget, setSelectedBudget, 'budget')}
      {renderOptionGroup('Minimum Rating', options.rating, selectedRating, setSelectedRating, 'rating')}

      <TouchableOpacity style={styles.button} onPress={applyFilters}>
        <Text style={styles.buttonText}>Start Swiping</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  group: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  selector: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  selectorText: { fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 10,
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalText: { fontSize: 16, textAlign: 'center' },
  modalCancel: { marginTop: 16 },
  modalCancelText: { textAlign: 'center', color: 'red', fontSize: 16 },
  button: {
    marginTop: 30,
    backgroundColor: '#FF5A5F',
    paddingVertical: 16,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});

export default FilterScreen;