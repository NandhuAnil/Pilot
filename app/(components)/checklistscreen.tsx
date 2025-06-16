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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const APIURL = "https://5b7d-103-163-95-99.ngrok-free.app";
// const APIURL = "https://appsail-50027943202.development.catalystappsail.in";

type GuidelineItem = {
  title: string;
  description: string;
  checked?: boolean;
};

export default function ChecklistScreen() {
  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);

  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loadGuidelines = () => {
      const jsonData = require('@/assets/guidelines.json');
      const checklist = jsonData.map((item: GuidelineItem) => ({
        ...item,
        checked: false,
      }));
      setGuidelines(checklist);
    };

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

  const handleNext = () => {
        router.push({
            pathname: '/(components)/AfterFlyingImageUploader',
            params: {
                pilotInfo: params.pilotInfo,
                weatherReport: params.weatherReport,
                username: params.username,
                beforeFlyingImage: params.beforeFlyingImage,
                guidelines: JSON.stringify(guidelines),
            },
        });
    };

<<<<<<< HEAD
    try {
      const response = await fetch('https://6098-2409-408d-71e-8cbd-2511-a1e1-a748-49d2.ngrok-free.app/api/checklist/save', {
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

=======
>>>>>>> 662420e01c1fc76690535bbd862824f085123eb4
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pre-Approved List</Text>
      {guidelines.map((item, index) => (
        <View key={index} style={styles.row}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => toggleCheck(index)}
            onLongPress={() => showDescription(item.description)}
          >
            <Text style={styles.label}>{item.title}</Text>
          </TouchableOpacity>
          <Checkbox
            value={item.checked}
            onValueChange={() => toggleCheck(index)}
            color={item.checked ? Colors.primary : undefined}
            style={styles.checkbox}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
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
