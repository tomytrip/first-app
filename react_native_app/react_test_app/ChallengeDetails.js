import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const participerImage = require('./assets/challenges/rejoindre.png');
const checkImage = require('./assets/challenges/coche.png');

const headerHeight = 120;
const footerHeight = 100;

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

export default function ChallengeDetails({ route, navigation }) {
  const { categoryId, categoryName, status } = route.params;
  const [defis, setDefis] = useState([]);
  const [defisActifs, setDefisActifs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      // Construisez l'URL en fonction du statut
      const url = `http://192.168.1.83:8000/test_app/api/defis-disponibles/${categoryId}/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDefis(data);
      } else {
        console.log("Réponse de l'API avec erreur", response.status);
      }
    };

    fetchData();
  }, [categoryId, status]); 


  // Gère l'activation d'un défi
  const activerDefi = async (index) => {
    const token = await getToken();
    const defi = defis[index];
    const data = {
      challenge: defi.id,
    };

    try {
      const response = await fetch('http://192.168.1.83:8000/test_app/api/participer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Problème lors de la participation au défi: ${response.status} - ${errorBody}`);
      }

      const participation = await response.json();
      console.log('Participation réussie:', participation);
      
      const newDefisActifs = [...defisActifs];
      if (!newDefisActifs.includes(index)) {
        newDefisActifs.push(index);
        setDefisActifs(newDefisActifs);
      }

    } catch (error) {
      console.error('Erreur lors de la participation au défi:', error);
    }
  };

  // Stub pour la prise de photo
  const prendrePhoto = () => {
    console.log('Prendre une photo');
    // Ici, vous intégreriez la logique pour ouvrir la caméra et prendre une photo
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('./assets/header/arrow-back.png')} // Assurez-vous d'avoir une icône de flèche dans vos assets
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Défis disponibles</Text>
        <TouchableOpacity onPress={() => {/* action quand le profil est cliqué */}}>
          <Image
            source={require('./assets/header/profile.png')}
            style={{ width: 44, height: 44, marginTop: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {defis.map((defi, index) => {
          return (
            <View key={index} style={styles.defiContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('PalierPage', { challengeId: defi.id, activeFooter: 'nouveau' })}>
                <View style={styles.defiDetails}>
                  <Image source={{ uri: defi.image }} style={styles.image} />
                  <Text style={styles.defiTitle}>{defi.titre}</Text>
                </View>
              </TouchableOpacity>
              {defisActifs.includes(index) ? (
                <TouchableOpacity onPress={prendrePhoto} style={styles.bouton}>
                  <Image source={checkImage} style={styles.boutonImage} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => activerDefi(index)} style={styles.bouton}>
                  <Image source={participerImage} style={styles.boutonImage} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerSection, status === 'nouveau' ? styles.activeSection : {}]}
          onPress={() => navigation.navigate('ChallengePage', { status: 'nouveau' })}
        >
          <Image source={require('./assets/footer/nouveau.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerSection, status === 'en_cours' ? styles.activeSection : {}]}
          onPress={() => navigation.navigate('DefisEnCoursPage')}
        >
          <Image source={require('./assets/footer/sablier.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerSection, status === 'terminé' ? styles.activeSection : {}]}
          onPress={() => navigation.navigate('KPIsPage')}
        >
          <Image source={require('./assets/footer/barre-graphique.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: headerHeight + 50, // Ajout d'un paddingTop équivalent à la hauteur du header
    paddingBottom: footerHeight, // Optionnel : Ajoutez ceci si vous voulez aussi espace pour le footer
    paddingHorizontal: 20, // Gardez votre padding latéral comme avant
  },
  header: {
    backgroundColor: '#add8e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: headerHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerText: {
    fontSize: 20,
    marginTop: 50, 
    marginRight: 10,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 10,
    marginTop: 40,
  },
  defiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    alignItems: 'center',
    backgroundColor: '#add8e6',
    borderRadius: 10,
    padding: 10,
  },
  defiDetails: {
    flexDirection: 'row', // Assure l'alignement horizontal de l'image et du texte
    alignItems: 'center', // Centre verticalement les éléments enfants
    justifyContent: 'space-between',
  },
  defiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Espace entre l'image et le texte
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#add8e6',
    height: footerHeight,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeSection: {
    backgroundColor: '#666',
    height: '100%',
    width: '100%',
  },
  boutonImage: {
    width: 50, // Ajustez ces valeurs selon la taille de vos images
    height: 50,
  }
});
