import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ChecklistDetailsScreen() {
  const { username, index } = useLocalSearchParams();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const unitsMap: Record<string, string> = {
    temperature: '°C',
    precipitation: 'mm',
    humidity: '%',
    wind: 'km/h',
  };

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(
          `https://appsail-50027943202.development.catalystappsail.in/api/checklist/${username}`
        );
        const data = await response.json();
        setEntry(data.data?.[parseInt(index as string)]);
      } catch (err) {
        console.error("Error fetching entry details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, []);

  if (loading)
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#007AFF" />;

  if (!entry)
    return <Text style={{ padding: 20, fontSize: 16 }}>No data found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Pilot Info Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>Pilot Info</Text>
        {Object.entries(entry.pilotInfo || {}).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{capitalize(key)}:</Text>
            <Text style={styles.value}>{String(value)}</Text>
          </View>
        ))}
      </View>

      {/* Weather Report Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>Weather Report</Text>
        {Object.entries(entry.weatherReport || {}).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{capitalize(key)}:</Text>
            <Text style={styles.value}>{String(value)} {unitsMap[key] || ''}</Text>
          </View>
        ))}
      </View>

      {/* Checklist Card */}
      <View style={styles.card}>
        <Text style={styles.heading}>Checklist</Text>
        {entry.checklist.map((item: any, i: number) => (
          <View key={i} style={styles.checklistRow}>
            <Text style={styles.checklistLabel}>{item.title}</Text>
            <View
              style={[
                styles.statusBadge
              ]}
            >
              <Text style={styles.statusText}>
                {item.checked ? "✅" : "❌"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Helper to capitalize keys nicely
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
    paddingBottom: 6,
    marginBottom: 12,
    color: "#007AFF",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontWeight: "500",
    color: "#444",
    fontSize: 16,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: "#555",
  },
  checklistRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  checklistLabel: {
    fontSize: 17,
    color: "#333",
    width: "70%"
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 70,
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#4caf50",
  },
  notChecked: {
    backgroundColor: "#f44336",
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
  },
});
