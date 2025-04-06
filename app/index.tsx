import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { translations, LanguageCode } from '../utils/language';

export default function LandingScreen() {
  const [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn('Error with SplashScreen:', e);
      }
    }
    
    prepare();
    
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(e => console.warn('Error hiding splash screen:', e));
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'hi' : 'en');
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={toggleLanguage}
      >
        <Text style={styles.languageText}>
          {currentLanguage === 'en' ? 'हिंदी' : 'English'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>{translations[currentLanguage].title}</Text>
      <Text style={styles.subtitle}>{translations[currentLanguage].subtitle}</Text>
      
      <Link href="/(tabs)/home" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
          {translations[currentLanguage].getStarted}
          </Text>
        </Pressable>
      </Link>
      
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>
        {translations[currentLanguage].ivrMode}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 48,
    color: '#1E88E5',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
  },
  secondaryButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    textAlign: 'center',
  },
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  languageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
});