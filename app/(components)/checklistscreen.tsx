import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
        Alert.alert('Error', 'Failed to load data');
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
    const payload = {
      username,
      pilotInfo,
      weatherReport,
      checklist: guidelines,
    };

    try {
      const response = await fetch('http://192.168.10.102:3000/api/checklist/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Submitted', 'Checklist data submitted successfully');
        router.push("/(tabs)")
      } else {
        Alert.alert('Error', result.message || 'Failed to submit');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Could not reach backend');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pre-Flight Checklist</Text>
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
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
