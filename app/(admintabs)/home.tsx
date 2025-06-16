import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

type RoleType = "" | "admin" | "user";

export default function AddUserScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<RoleType>("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const handleCreateUser = async () => {
    if (!username || !password || !role) {
      ToastAndroid.show("Missing Fields - All fields are required.", ToastAndroid.SHORT);
      return;
    }

    try {
<<<<<<< HEAD
      const response = await fetch("https://6098-2409-408d-71e-8cbd-2511-a1e1-a748-49d2.ngrok-free.app/api/auth/register", {
=======
      const response = await fetch("https://0657-103-163-95-99.ngrok-free.app/api/auth/register", {
>>>>>>> 662420e01c1fc76690535bbd862824f085123eb4
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
<<<<<<< HEAD
        ToastAndroid.show("User created successfully", ToastAndroid.SHORT);
        setUsername("");
        setPassword("");
        setRole("");
=======
        // ToastAndroid.show("User created successfully", ToastAndroid.SHORT);
        console.log("user created successfully")
>>>>>>> 662420e01c1fc76690535bbd862824f085123eb4
      } else {
        // ToastAndroid.show("Error", data.message || "Failed to create user.");
        console.log("Error", data.message)
      }
    } catch (err) {
      console.error(err);
      // ToastAndroid.show("Network Error", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New User</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
        autoCapitalize="none"
      />

      {/* <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      /> */}
      <View
        style={{
          width: "100%",
          height: 48,
          borderColor: Colors.black,
          borderWidth: 1,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 22,
          marginBottom: 15,
        }}
      >
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={Colors.black}
          secureTextEntry={!isPasswordShown}
          style={{
            width: "100%",
            color: "#000"
          }}
          value={password}
          onChangeText={setPassword}
          cursorColor={Colors.primary}
        />

        <TouchableOpacity
          onPress={() => setIsPasswordShown(!isPasswordShown)}
          style={{
            position: "absolute",
            right: 12,
          }}
        >
          {isPasswordShown == true ? (
            <Ionicons name="eye-off" size={24} color={Colors.black} />
          ) : (
            <Ionicons name="eye" size={24} color={Colors.black} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(value) => setRole(value as RoleType)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Pilot" value="user" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
    color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    color: "#333",
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
});
