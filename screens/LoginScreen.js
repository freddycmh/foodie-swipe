import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Trying to log in...');
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Login success!');
        navigation.replace("Home");
      })
      .catch((error) => {
        console.log('Login error:', error.message);
        Alert.alert("Login Error", error.message);
      });
  };

  const handleSignUp = () => {
    console.log('Trying to sign up...');
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Signup success!');
        Alert.alert("Success", "Account created!");
      })
      .catch((error) => {
        console.log('Signup error:', error.message);
        Alert.alert("Signup Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍜 Foodie Swipe</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.button}>
        <Button title="Login" onPress={handleLogin} />
      </View>
      <View style={styles.button}>
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 30, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    marginVertical: 5,
  },
});