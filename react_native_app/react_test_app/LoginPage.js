// LoginPage.js
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Tentative de connexion avec', email, password);

    try {
      const response = await fetch('http://192.168.1.83:8000/test_app/api/login/', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token retourné
        console.log(data.token); // Utilisez AsyncStorage ou un moyen plus sécurisé pour le stocker
        navigation.navigate('ChallengePage');
      } else {
        alert(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de la connexion.');
    }
};

  

  return (
    <View style={styles.container}>
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
      <Button title="Connexion" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUpPage')}>
        <Text style={styles.linkText}>Pas de compte ? S'inscrire</Text>
      </TouchableOpacity>
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
  linkText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});

