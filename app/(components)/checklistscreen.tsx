import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Alert
} from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';

type GuidelineItem = {
  title: string;
  description: string;
  checked?: boolean;
};

export default function ChecklistScreen() {
  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);
  const [pilotInfo, setPilotInfo] = useState<any>(null);
  const [weatherReport, setWeatherReport] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const params = useLocalSearchParams();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const pilot = params.pilotInfo
          ? JSON.parse(params.pilotInfo as string)
          : JSON.parse((await AsyncStorage.getItem('pilotInfo')) || '{}');

        const weather = params.weatherReport
          ? JSON.parse(params.weatherReport as string)
          : JSON.parse((await AsyncStorage.getItem('weatherReport')) || '{}');

        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');

        setPilotInfo(pilot);
        setWeatherReport(weather);
        setToken(savedToken);
        setUsername(savedUser ? JSON.parse(savedUser).username : null);
      } catch (err) {
        ToastAndroid.show('Failed to load data', ToastAndroid.SHORT);
      }
    };

    const loadGuidelines = () => {
      const jsonData = require('@/assets/guidelines.json');
      const checklist = jsonData.map((item: GuidelineItem) => ({
        ...item,
        checked: false,
      }));
      setGuidelines(checklist);
    };

    loadInitialData();
    loadGuidelines();
  }, []);

  const toggleCheck = (index: number) => {
    const updated = [...guidelines];
    updated[index].checked = !updated[index].checked;
    setGuidelines(updated);
  };

  const showDescription = (description: string) => {
    Alert.alert('Guideline Info', description);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      username,
      pilotInfo,
      weatherReport,
      checklist: guidelines,
    };

    try {
      const response = await fetch('https://appsail-50027943202.development.catalystappsail.in/api/checklist/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        ToastAndroid.show('Submitted successfully', ToastAndroid.SHORT);
        router.push("/(tabs)")
      } else {
        ToastAndroid.show('Error', result.message || 'Failed to submit');
      }
    } catch (err) {
      ToastAndroid.show('Network Error', ToastAndroid.SHORT);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pre-Approved List</Text>
      {guidelines.map((item, index) => (
        <View key={index} style={styles.row}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => showDescription(item.description)}
          >
            <Text style={styles.label}>{item.title}</Text>
          </TouchableOpacity>
          <Checkbox
            value={item.checked}
            onValueChange={() => toggleCheck(index)}
            // onLongPress={() => showDescription(item.description)}
            color={item.checked ? Colors.primary : undefined}
            style={styles.checkbox}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
      <View>
        <Text style={{ textAlign: "center", color: '#ddd', position: 'relative', bottom: 0 }}>Powered by VAANFLY</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    marginBottom: 90,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
