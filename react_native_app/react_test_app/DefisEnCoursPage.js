import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const headerHeight = 120;
const footerHeight = 100;

export default function DefisEnCoursPage({ navigation }) {
  const [defis, setDefis] = useState([]);

  useEffect(() => {
    const fetchDefisEnCours = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const response = await fetch('http://192.168.1.83:8000/test_app/api/tous-defis-en-cours/', {
            headers: { Authorization: `Token ${token}` },
          });
          const data = await response.json();
          console.log("Données reçues de l'API:", data);
          setDefis(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des défis en cours:", error);
        }
      }
    };

    fetchDefisEnCours();
  }, []);

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
        <Text style={styles.headerText}>Défis en cours</Text>
        <TouchableOpacity onPress={() => {/* action quand le profil est cliqué */}}>
          <Image
            source={require('./assets/header/profile.png')}
            style={{ width: 44, height: 44, marginTop: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {defis.map((categorie, indexCategorie) => (
          <View key={indexCategorie}>
            <View style={styles.categorieContainer}>
              <Image source={{ uri: categorie.image }} style={styles.categorieImage} />
              <Text style={styles.categorieTitle}>{categorie.nom}</Text>
            </View>
            {categorie.defis.map((defi, indexDefi) => (
              <TouchableOpacity key={indexDefi} onPress={() => navigation.navigate('PalierPage', { challengeId: defi.id, activeFooter: 'en_cours' })} style={styles.defiContainer}>
                <Image source={{ uri: defi.image }} style={styles.image} />
                <Text style={styles.defiTitle}>{defi.titre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerSection]}
          onPress={() => navigation.navigate('ChallengePage', { status: 'nouveau' })}>
          <Image source={require('./assets/footer/nouveau.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerSection, styles.activeSection]}
          onPress={() => navigation.navigate('DefisEnCoursPage', { status: 'en_cours' })}>
          <Image source={require('./assets/footer/sablier.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerSection]}
          onPress={() => navigation.navigate('KPIsPage', { status: 'terminé' })}>
          <Image source={require('./assets/footer/barre-graphique.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: headerHeight + 50,
    paddingBottom: footerHeight,
    paddingHorizontal: 20,
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
  profileIcon: {
    width: 44,
    height: 44,
    marginTop: 40,
    marginRight: 10,
  },
  defiContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
    backgroundColor: '#add8e6',
    borderRadius: 10,
    padding: 10,
  },
  defiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
  footerIcon: {
    width: 44,
    height: 44,
  },
  activeSection: {
    backgroundColor: '#666',
    height: '100%',
    width: '100%',
  },
  categorieImage: {
    width: 30, // Ajustez selon vos besoins
    height: 30, // Ajustez selon vos besoins
    borderRadius: 15, // Pour un effet arrondi
    marginLeft: 'auto', // Pour aligner à droite dans le conteneur flex
  },
  categorieContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#666',
    borderRadius: 15
  },
  categorieImage: {
    width: 30, // Ajustez selon vos besoins
    height: 30, // Ajustez selon vos besoins
    borderRadius: 15, // Pour un effet arrondi
    marginRight: 10, // Espacement entre le texte et l'image
  },
  categorieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Permet au texte de prendre l'espace disponible
  },
});
