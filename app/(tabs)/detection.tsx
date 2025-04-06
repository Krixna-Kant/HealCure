// app/(tabs)/detection.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../../utils/language';

export default function DetectionScreen() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert(t('permission_denied'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect for consistency
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(t('permission_denied'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      // TODO: Replace with actual AIxplain API call
      console.log("Analyzing image:", image);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock analysis
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('detection_title')}</Text>
      
      {/* Image Preview */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <MaterialIcons name="image-search" size={100} color="#ccc" />
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={24} color="white" />
          <Text style={styles.buttonText}>{t('gallery')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <MaterialIcons name="photo-camera" size={24} color="white" />
          <Text style={styles.buttonText}>{t('camera')}</Text>
        </TouchableOpacity>
      </View>

      {/* Analysis Button */}
      <TouchableOpacity 
        style={[styles.analyzeButton, !image && styles.disabledButton]} 
        onPress={analyzeImage}
        disabled={!image || isAnalyzing}
      >
        {isAnalyzing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.analyzeButtonText}>{t('analyze')}</Text>
        )}
      </TouchableOpacity>

      {/* Results Placeholder */}
      {isAnalyzing && (
        <Text style={styles.statusText}>{t('analyzing')}...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E88E5',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  statusText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});