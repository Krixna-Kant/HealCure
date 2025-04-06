import { StyleSheet, View, Text, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../utils/language';
import { WebView } from 'react-native-webview';

export default function MapScreen() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  // Mock medical places data
  const medicalPlaces = [
    { id: 1, name: t('clinic'), lat: 28.6139, lng: 77.2090, type: 'clinic' },
    { id: 2, name: t('hospital'), lat: 28.6149, lng: 77.2050, type: 'hospital' },
    { id: 3, name: t('pharmacy'), lat: 28.6129, lng: 77.2070, type: 'pharmacy' },
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'web') return;

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('permission_denied'));
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const generateHTML = () => {
    const userLat = location?.coords.latitude || 28.6139;
    const userLng = location?.coords.longitude || 77.2090;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <link 
            rel="stylesheet" 
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            crossorigin=""
          />
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            .custom-icon {
              background: ${Platform.OS === 'web' ? '#1E88E5' : '#4CAF50'};
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
          <script>
            const map = L.map('map').setView([${userLat}, ${userLng}], 14);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // User location marker
            const userIcon = L.divIcon({
              className: 'custom-icon',
              html: '📍',
              iconSize: [30, 30]
            });
            
            L.marker([${userLat}, ${userLng}], {
              icon: userIcon
            })
              .addTo(map)
              .bindPopup('${t('your_location')}');

            // Medical places
            const places = ${JSON.stringify(medicalPlaces)};
            
            places.forEach(place => {
              L.marker([place.lat, place.lng])
                .addTo(map)
                .bindPopup('<b>' + place.name + '</b>');
            });
          </script>
        </body>
      </html>
    `;
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe 
          srcDoc={generateHTML()} 
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!location ? (
        <ActivityIndicator size="large" color="#1E88E5" />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: generateHTML() }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#1E88E5" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  error: {
    color: 'red',
    padding: 20,
    textAlign: 'center',
  },
});