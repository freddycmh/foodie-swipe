import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

const FilterScreen = ({ navigation }) => {
  const [cuisine, setCuisine] = useState('japanese');
  const [budget, setBudget] = useState('$');
  const [rating, setRating] = useState('4');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Cuisine</Text>
        <Picker selectedValue={cuisine} onValueChange={setCuisine}>
          <Picker.Item label="Japanese" value="japanese" />
          <Picker.Item label="Mexican" value="mexican" />
          <Picker.Item label="Italian" value="italian" />
          <Picker.Item label="Chinese" value="chinese" />
        </Picker>

        <Text style={styles.label}>Budget</Text>
        <Picker selectedValue={budget} onValueChange={setBudget}>
          <Picker.Item label="$" value="$" />
          <Picker.Item label="$$" value="$$" />
          <Picker.Item label="$$$" value="$$$" />
        </Picker>

        <Text style={styles.label}>Minimum Rating</Text>
        <Picker selectedValue={rating} onValueChange={setRating}>
          <Picker.Item label="3+" value="3" />
          <Picker.Item label="4+" value="4" />
          <Picker.Item label="4.5+" value="4.5" />
        </Picker>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Start Swiping"
          onPress={() =>
            navigation.navigate('Home', {
              cuisine,
              budget,
              rating,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40, // Keeps it above the iPhone nav bar
  },
});

export default FilterScreen;