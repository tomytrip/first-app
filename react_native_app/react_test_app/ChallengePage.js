import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const headerHeight = 120;
const footerHeight = 100;
const itemWidth = 140;

export default function ChallengePage({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('nouveau');

  // Remplacé par useFocusEffect
  useFocusEffect(
    useCallback(() => {
      if (route.params?.status) {
        setCurrentStatus(route.params.status);
      }

      const fetchCategories = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) {
            Alert.alert("Erreur d'authentification", "Impossible de récupérer le token d'authentification.");
            return;
          }

          const url = `http://192.168.1.83:8000/test_app/api/categories/`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
          });

          if (!response.ok) throw new Error('Réponse réseau non ok');

          const data = await response.json();
          setCategories(data.map((item, index) => ({
            key: String(index),
            text: item.nom,
            image: { uri: item.image },
            id: item.id,
          })));
        } catch (error) {
          console.error("Erreur lors de la récupération des catégories:", error);
        }
      };

      fetchCategories();
    }, [route.params?.status])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('./assets/header/arrow-back.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Catégories disponibles</Text>
        <TouchableOpacity onPress={() => {/* action quand le profil est cliqué */}}>
          <Image
            source={require('./assets/header/profile.png')}
            style={{ width: 44, height: 44, marginTop: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() =>
              navigation.navigate('ChallengeDetails', {
                categoryId: item.id,
                categoryName: item.text,
                status: currentStatus,
              })
            }
            style={styles.item}>
            <View style={styles.circle}>
              <Image source={item.image} style={styles.image} />
            </View>
            <Text style={styles.text}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerSection, currentStatus === 'nouveau' ? styles.activeSection : {}]}
          onPress={() => navigation.navigate('ChallengePage', { status: 'nouveau' })}>
          <Image source={require('./assets/footer/nouveau.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerSection, currentStatus === 'en_cours' ? styles.activeSection : {}]}
          onPress={() => navigation.navigate('DefisEnCoursPage')}>
          <Image source={require('./assets/footer/sablier.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerSection, currentStatus === 'terminé' ? styles.activeSection : {}]}
          onPress={() => navigation.navigate('KPIsPage')}>
          <Image source={require('./assets/footer/barre-graphique.png')} style={{ width: 44, height: 44 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: headerHeight,
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
  scrollViewContent: {
    alignItems: 'center',
    padding: 20,
  },
  item: {
    width: itemWidth,
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: -110,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'black',
    overflow: 'hidden',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#add8e6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    overflow: 'hidden',
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
});
