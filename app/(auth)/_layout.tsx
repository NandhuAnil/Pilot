import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, View, Text } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: "#FFF",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index"
          options={{
            headerShown: true,
            headerTitle: "Login",
            headerRight: () => (
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginRight: 10 }}>
                <Image
                  source={require('../../assets/images/mainlogo.png')}
                  style={{ width: 40, height: 40}}
                />
                <Text style={{ color: '#fff', fontWeight: "500", fontSize: 16 }}>VAANFLY</Text>
              </View>
            ),
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}