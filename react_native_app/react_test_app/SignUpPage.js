import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';
// Import AsyncStorage pour stocker le token
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpPage({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://192.168.1.83:8000/test_app/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token dans AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        console.log('Inscription réussie, token stocké :', data.token);
        Alert.alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
        navigation.navigate('Login');
      } else {
        // Gérer les erreurs de réponse de l'API
        console.error('Erreur lors de l\'inscription:', data.error);
        Alert.alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      Alert.alert('Erreur lors de l\'inscription: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="Prénom"
      />
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Nom"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Mot de passe"
        secureTextEntry
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
});
