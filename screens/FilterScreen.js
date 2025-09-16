import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, StatusBar, ScrollView, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFilter } from '../context/FilterContext';

const { width: screenWidth } = Dimensions.get('window');

const options = {
  cuisine: [
    'Any', 'American', 'Asian', 'BBQ', 'Breakfast', 'Burger', 'Cafe', 'Chinese',
    'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean',
    'Mexican', 'Middle Eastern', 'Pizza', 'Seafood', 'Steakhouse', 'Sushi',
    'Thai', 'Vietnamese', 'Vegetarian', 'Vegan'
  ],
  budget: ['Any', '$', '$$', '$$$'],
  rating: ['Any', '3+', '4+', '4.5+'],
  radius: ['Any', '1 km', '2 km', '5 km', '10 km', '15 km'],
};

const FilterScreen = () => {
  const navigation = useNavigation();
  const { filters, setFilters } = useFilter();

  const [selectedCuisine, setSelectedCuisine] = useState('Any');
  const [selectedBudget, setSelectedBudget] = useState('Any');
  const [selectedRating, setSelectedRating] = useState('Any');
  const [selectedRadius, setSelectedRadius] = useState('Any');
  const [modalVisible, setModalVisible] = useState(null);

  useEffect(() => {
    if (filters) {
      setSelectedCuisine(filters.cuisine ?
        options.cuisine.find(c => c.toLowerCase() === filters.cuisine) || 'Any' : 'Any');
      setSelectedBudget(filters.budget || 'Any');
      setSelectedRating(filters.rating ? `${filters.rating}+` : 'Any');
      setSelectedRadius(filters.radius ? `${filters.radius} km` : 'Any');
    }
  }, [filters]);

  const applyFilters = () => {
    try {
      const newFilters = {
        cuisine: selectedCuisine === 'Any' ? null : selectedCuisine.toLowerCase(),
        budget: selectedBudget === 'Any' ? null : selectedBudget,
        rating: selectedRating === 'Any' ? null : parseFloat(selectedRating.replace('+', '')),
        radius: selectedRadius === 'Any' ? null : parseInt(selectedRadius.replace(' km', '')),
      };
      setFilters(newFilters);
      navigation.navigate('SwipeMain');
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCuisine('Any');
    setSelectedBudget('Any');
    setSelectedRating('Any');
    setSelectedRadius('Any');
  };

  const getIconForCategory = (key) => {
    switch (key) {
      case 'cuisine': return '🍽️';
      case 'budget': return '💰';
      case 'rating': return '⭐';
      case 'radius': return '📍';
      default: return '🔧';
    }
  };

  const renderOptionGroup = (label, values, selectedValue, setter, key) => (
    <View style={styles.group}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelIcon}>{getIconForCategory(key)}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.selector,
          selectedValue !== 'Any' && styles.selectorActive
        ]}
        onPress={() => setModalVisible(key)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.selectorText,
          selectedValue !== 'Any' && styles.selectorTextActive
        ]}>
          {selectedValue}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible === key} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {values.map((value, index) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.modalOption,
                    value === selectedValue && styles.modalOptionSelected,
                    index === values.length - 1 && styles.modalOptionLast
                  ]}
                  onPress={() => {
                    setter(value);
                    setModalVisible(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.modalText,
                    value === selectedValue && styles.modalTextSelected
                  ]}>
                    {value}
                  </Text>
                  {value === selectedValue && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          {renderOptionGroup('Distance', options.radius, selectedRadius, setSelectedRadius, 'radius')}
          {renderOptionGroup('Cuisine Type', options.cuisine, selectedCuisine, setSelectedCuisine, 'cuisine')}
          {renderOptionGroup('Price Range', options.budget, selectedBudget, setSelectedBudget, 'budget')}
          {renderOptionGroup('Minimum Rating', options.rating, selectedRating, setSelectedRating, 'rating')}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Current Filters</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Distance:</Text>
            <Text style={styles.summaryValue}>{selectedRadius}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cuisine:</Text>
            <Text style={styles.summaryValue}>{selectedCuisine}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Budget:</Text>
            <Text style={styles.summaryValue}>{selectedBudget}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rating:</Text>
            <Text style={styles.summaryValue}>{selectedRating}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters} activeOpacity={0.8}>
          <Text style={styles.clearButtonIcon}>🗑️</Text>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={applyFilters} activeOpacity={0.8}>
          <Text style={styles.buttonIcon}>❤️</Text>
          <Text style={styles.buttonText}>Start Swiping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  group: {
    marginBottom: 32,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  labelIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e8ecef',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  selectorActive: {
    borderColor: '#FF5A5F',
    backgroundColor: '#fff5f5',
  },
  selectorText: {
    fontSize: 18,
    color: '#495057',
    fontWeight: '600',
  },
  selectorTextActive: {
    color: '#FF5A5F',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomColor: '#f1f3f4',
    borderBottomWidth: 1,
    borderRadius: 12,
    marginVertical: 2,
  },
  modalOptionSelected: {
    backgroundColor: '#fff5f5',
    borderBottomColor: 'transparent',
  },
  modalOptionLast: {
    borderBottomWidth: 0,
  },
  modalText: {
    fontSize: 18,
    color: '#495057',
    fontWeight: '500',
  },
  modalTextSelected: {
    color: '#FF5A5F',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 20,
    color: '#FF5A5F',
    fontWeight: '700',
  },
  summaryCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#FF5A5F',
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
    gap: 16,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  clearButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  clearButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A5F',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#FF5A5F',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default FilterScreen;