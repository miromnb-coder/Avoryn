import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { useAvorynSession } from "../../hooks/useAvorynSession";
import { AvorynEmailAuthScreen } from "./AvorynEmailAuthScreen";
import { AvorynWelcomeScreen } from "./AvorynWelcomeScreen";

type AuthView = "welcome" | "email";

type AvorynAuthGateProps = {
  children: ReactNode;
};

export function AvorynAuthGate({ children }: AvorynAuthGateProps) {
  const { isCheckingSession, isSignedIn } = useAvorynSession();
  const [authView, setAuthView] = useState<AuthView>("welcome");

  useEffect(() => {
    if (isSignedIn) {
      setAuthView("welcome");
    }
  }, [isSignedIn]);

  if (isCheckingSession) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (isSignedIn) {
    return <>{children}</>;
  }

  if (authView === "email") {
    return <AvorynEmailAuthScreen onBack={() => setAuthView("welcome")} onSignedIn={() => setAuthView("welcome")} />;
  }

  return <AvorynWelcomeScreen onEmailContinue={() => setAuthView("email")} />;
}

const styles = StyleSheet.create({
  loadingScreen: {
    alignItems: "center",
    backgroundColor: colors.drawerBackground,
    flex: 1,
    justifyContent: "center",
  },
});
