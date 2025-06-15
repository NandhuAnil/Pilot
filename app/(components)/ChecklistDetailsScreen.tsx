import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const APIURL = "https://6098-2409-408d-71e-8cbd-2511-a1e1-a748-49d2.ngrok-free.app";

export default function ChecklistDetailsScreen() {
  const { entryId, username } = useLocalSearchParams();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const unitsMap: Record<string, string> = {
    temperature: "°C",
    precipitation: "mm",
    humidity: "%",
    wind: "km/h",
  };

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`${APIURL}/api/checklist/${username}`);
        const data = await response.json();
        if (data && data.pilotInfo) {
          setEntry(data); // Data is already parsed on backend
        } else {
          console.warn("Invalid data format:", data);
          setEntry(null);
        }
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
      {/* Pilot Info */}
      <View style={styles.card}>
        <Text style={styles.heading}>Pilot Info</Text>
        {Object.entries(entry.pilotInfo || {}).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{capitalize(key)}:</Text>
            <Text style={styles.value}>{String(value)}</Text>
          </View>
        ))}
      </View>

      {/* Weather Report */}
      <View style={styles.card}>
        <Text style={styles.heading}>Weather Report</Text>
        {Object.entries(entry.weatherReport || {}).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{capitalize(key)}:</Text>
            <Text style={styles.value}>
              {String(value)} {unitsMap[key] || ""}
            </Text>
          </View>
        ))}
      </View>

      {/* Checklist */}
      <View style={styles.card}>
        <Text style={styles.heading}>Checklist</Text>
        {entry.checklist?.map((item: any, i: number) => (
          <View key={i} style={styles.checklistRow}>
            <Text style={styles.checklistLabel}>{item.title}</Text>
            <Text style={[styles.statusText, item.checked ? styles.checked : styles.notChecked]}>
              {item.checked ? "✅" : "❌"}
            </Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={{ textAlign: "center", color: '#ddd', position: 'relative', bottom: 0 }}>Powered by VAANFLY</Text>
      </View>
    </ScrollView>
  );
}

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    width: "70%",
  },
  checked: {
    color: "#4caf50",
    fontWeight: "700",
  },
  notChecked: {
    color: "#f44336",
    fontWeight: "700",
  },
  statusText: {
    fontSize: 18,
  },
});
