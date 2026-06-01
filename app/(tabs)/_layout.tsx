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
          backgroundColor: focused ? colors.primary : colors.primaryDark,
          borderRadius: 999,
          height: 54,
          justifyContent: "center",
          marginBottom: 12,
          width: 54,
        }}
      >
        <MaterialCommunityIcons name={name} size={26} color={colors.card} />
      </View>
    );
  }

  return <MaterialCommunityIcons name={name} size={25} color={color} />;
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
          height: 86,
          paddingBottom: 18,
          paddingTop: 10,
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
