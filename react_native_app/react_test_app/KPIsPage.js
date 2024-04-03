import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';

const KPIsPage = ({ navigation }) => {
  // Exemple de données KPIs fictives
  const kpis = [
    { label: 'Défis Complétés', value: '14' },
    { label: 'Heures Économisées', value: '5h' },
    { label: 'CO2 Économisé', value: '2.5kg' },
  ];

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
        <Text style={styles.headerText}>Ton impact</Text>
        <TouchableOpacity onPress={() => {/* action quand le profil est cliqué */}}>
          <Image
            source={require('./assets/header/profile.png')}
            style={{ width: 44, height: 44, marginTop: 40, marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.kpiContainer}>
        {kpis.map((kpi, index) => (
          <View key={index} style={styles.kpi}>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerSection]}
          onPress={() => navigation.navigate('ChallengePage', { status: 'nouveau' })}>
          <Image source={require('./assets/footer/nouveau.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerSection]}
          onPress={() => navigation.navigate('DefisEnCoursPage')}>
          <Image source={require('./assets/footer/sablier.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.footerSection, styles.activeSection]}
          onPress={() => navigation.navigate('KPIsPage')}>
          <Image source={require('./assets/footer/barre-graphique.png')} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 120,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#add8e6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 120,
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
    marginRight: 10,
  },
  kpiContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  kpi: {
    backgroundColor: '#add8e6',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    width: '80%',
    alignItems: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  kpiLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#add8e6',
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerIcon: {
    width: 44,
    height: 44,
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

export default KPIsPage;
