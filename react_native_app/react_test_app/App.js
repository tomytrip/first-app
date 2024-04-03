import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ChallengePage from './ChallengePage';
import ChallengeDetails from './ChallengeDetails';
import PalierPage from './PalierPage';
import DefisEnCoursPage from './DefisEnCoursPage';
import KPIsPage from './KPIsPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Connexion' }}/>
        <Stack.Screen name="SignUpPage" component={SignUpPage} options={{ title: 'Inscription' }}/>
        <Stack.Screen name="ChallengePage" component={ChallengePage} options={{ title: 'Challenges', headerShown: false }}/>
        <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} options={({ route }) => ({ title: route.params.categoryName, headerShown: false })} />
        <Stack.Screen name="PalierPage" component={PalierPage} options={{ title: 'Paliers', headerShown: false }}/>
        <Stack.Screen name="DefisEnCoursPage" component={DefisEnCoursPage} options={{ title: 'Defis en cours', headerShown: false }}/>
        <Stack.Screen name="KPIsPage" component={KPIsPage} options={{ title: 'KPIs', headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
