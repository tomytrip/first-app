import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, TouchableOpacity, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width: viewportWidth } = Dimensions.get('window');

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

const PalierPage = ({ route, navigation }) => {
  const { challengeId } = route.params;
  const [paliers, setPaliers] = useState([]);
  const [index, setIndex] = useState(0);
  const { activeFooter } = route.params || { activeFooter: 'en_cours' };
  console.log(activeFooter)

  useEffect(() => {
    const fetchPaliers = async () => {
      const token = await getToken();
      const response = await fetch(`http://192.168.1.83:8000/test_app/api/paliers-du-challenge/${challengeId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaliers(data);
      } else {
        console.log("Erreur lors de la récupération des paliers", response.status);
      }
    };

    fetchPaliers();
  }, [challengeId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Les paliers</Text>
        <TouchableOpacity onPress={() => console.log('Profil et paramètres')}>
          <Image
            source={require('./assets/header/profile.png')}
            style={{ width: 44, height: 44, marginTop: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      <Carousel
        loop
        width={viewportWidth}
        data={paliers}
        scrollAnimationDuration={1000}
        onProgressChange={(_, absoluteProgress) => {
          setIndex(Math.round(absoluteProgress));
        }}
        renderItem={({ item }) => (
          <View style={styles.carouselItemContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.palierTitle}>{item.titre}</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.palierDescription}>{item.description}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.paginationContainer}>
        {paliers.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        {/* Footer Sections */}
        <View style={[styles.footerSection, activeFooter === 'nouveau' ? styles.activeSection : null]}>
          <TouchableOpacity onPress={() => navigation.navigate('ChallengePage', { status: 'nouveau' })}>
            <Image
              source={require('./assets/footer/nouveau.png')}
              style={{ width: 44, height: 44}}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.footerSection, activeFooter === 'en_cours' ? styles.activeSection : null]}>
          <TouchableOpacity onPress={() => navigation.navigate('DefisEnCoursPage', { status: 'en_cours' })}>
            <Image
                source={require('./assets/footer/sablier.png')}
                style={{ width: 44, height: 44}}
              />
          </TouchableOpacity>
        </View>
        <View style={[styles.footerSection, activeFooter === 'terminé' ? styles.activeSection : null]}>
          <TouchableOpacity onPress={() => navigation.navigate('KPIsPage', { status: 'terminé' })}>
            <Image
                source={require('./assets/footer/barre-graphique.png')}
                style={{ width: 44, height: 44}}
              />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: headerHeight,
    paddingBottom: footerHeight,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  palierContainer: {
    flex: 1, // Ceci permettra au conteneur de remplir tout l'espace vertical
    justifyContent: 'space-between', // Ceci répartira l'espace verticalement
    alignItems: 'center',
    padding: 20,
    paddingTop: 0, // Enlève le padding en haut pour le titre
  },
  carouselItemContainer: {
    flex: 1, // Utiliser flex pour remplir l'espace disponible
    justifyContent: 'center', // Centrer le contenu verticalement
    alignItems: 'center', // Centrer le contenu horizontalement
    padding: 30, // Espace vertical à l'intérieur de la vue du carrousel
    paddingTop: 40,
    paddingBottom: 70
  },
  titleContainer: {
    marginTop: 40,
    width: '100%', // Prendre toute la largeur
    alignItems: 'center', // Centrer le contenu
    backgroundColor: '#add8e6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  descriptionContainer: {
    justifyContent: 'center', // Centre le texte verticalement
    width: '100%', // Prendre toute la largeur
    backgroundColor: '#add8e6',
    padding: 10,
    borderRadius: 10,
  },
  palierTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  palierDescription: {
    fontSize: 16,
    height: '100%'
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    marginBottom: 20
  },
  activeDot: {
    backgroundColor: 'black',
  },
  inactiveDot: {
    backgroundColor: 'gray',
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
  },
});

export default PalierPage;
