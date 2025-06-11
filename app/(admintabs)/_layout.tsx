import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { AntDesign, Entypo } from "@expo/vector-icons";

export default function AdminTabLayout() {
    return (
        <Tabs
            initialRouteName="checklistListScreen"
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: "#FFF",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.text,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="checklistListScreen"
                options={{
                    title: "Report",
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="list" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: "Add Users",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="addusergroup" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
        </Tabs>
    );
}