import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFilter } from '../context/FilterContext';

const options = {
  cuisine: ['Japanese', 'Mexican', 'Italian', 'Chinese', 'Thai', 'Indian', 'American'],
  budget: ['$', '$$', '$$$'],
  rating: ['3+', '4+', '4.5+'],
};

const FilterScreen = () => {
  const navigation = useNavigation();
  const { setFilters } = useFilter();

  const [selectedCuisine, setSelectedCuisine] = useState('Japanese');
  const [selectedBudget, setSelectedBudget] = useState('$');
  const [selectedRating, setSelectedRating] = useState('4+');
  const [modalVisible, setModalVisible] = useState(null);

  const applyFilters = () => {
    setFilters({
      cuisine: selectedCuisine.toLowerCase(),
      budget: selectedBudget,
      rating: selectedRating.replace('+', ''),
    });
    navigation.navigate('Swipe');
  };

  const renderOptionGroup = (title, optionsArray, selectedValue, setter, key) => (
    <View style={styles.group}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(key)}
      >
        <Text style={styles.selectorText}>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible === key}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {optionsArray.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setter(option);
                  setModalVisible(null);
                }}
              >
                <Text style={styles.modalText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(null)}
            >
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
      {renderOptionGroup('Minimum Rating', options.rating, setSelectedRating, setSelectedRating, 'rating')}

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
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectorText: { fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalText: { fontSize: 16, textAlign: 'center' },
  modalCancel: { marginTop: 12 },
  modalCancelText: { textAlign: 'center', color: 'red', fontSize: 16 },
  button: {
    marginTop: 24,
    backgroundColor: '#FF5A5F',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});

export default FilterScreen;