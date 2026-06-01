import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const backgroundImage = require("../assets/backgrounds/avoryn-background.PNG");

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        const source = Image.resolveAssetSource(backgroundImage);

        if (source?.uri) {
          await Image.prefetch(source.uri);
        }
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepareApp();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#F5F8F2" },
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
