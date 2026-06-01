import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { colors } from "../../constants/colors";

function TabIcon({ name, color, focused }: { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string; focused: boolean }) {
  if (name === "barcode-scan") {
    return (
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.primaryDark,
          borderRadius: 999,
          height: 54,
          justifyContent: "center",
          marginBottom: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.16,
          shadowRadius: 9,
          width: 54,
        }}
      >
        <MaterialCommunityIcons name={name} size={25} color={colors.card} />
      </View>
    );
  }

  return <MaterialCommunityIcons name={name} size={24} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 84,
          paddingBottom: 17,
          paddingTop: 9,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ask",
          tabBarIcon: ({ color, focused }) => <TabIcon name="magnify" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: "Nearby",
          tabBarIcon: ({ color, focused }) => <TabIcon name="map-marker-outline" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, focused }) => <TabIcon name="barcode-scan" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabIcon name="account-outline" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
