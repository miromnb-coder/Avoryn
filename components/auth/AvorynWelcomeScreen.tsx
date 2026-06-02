import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type AvorynWelcomeScreenProps = {
  onEmailContinue: () => void;
};

export function AvorynWelcomeScreen({ onEmailContinue }: AvorynWelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text allowFontScaling={false} style={styles.logo}>
            Avoryn
          </Text>
          <Text allowFontScaling={false} style={styles.title}>
            Make better everyday decisions
          </Text>
          <Text allowFontScaling={false} style={styles.subtitle}>
            Sign in to keep your conversations, choices, and decision history connected.
          </Text>
        </View>

        <View style={styles.card}>
          <Pressable onPress={onEmailContinue} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Feather name="mail" size={24} color="#FFFFFF" />
            <Text allowFontScaling={false} style={styles.primaryButtonText}>
              Continue with Email
            </Text>
          </Pressable>

          <Pressable onPress={onEmailContinue} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text allowFontScaling={false} style={styles.secondaryMuted}>
              Already have an account?{' '}
            </Text>
            <Text allowFontScaling={false} style={styles.secondaryStrong}>
              Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.drawerBackground,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 52,
    paddingHorizontal: 28,
    paddingTop: 88,
  },
  hero: {
    alignItems: "center",
  },
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 44,
    fontWeight: "400",
    letterSpacing: -1.2,
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 39,
    fontWeight: "400",
    letterSpacing: -1.1,
    lineHeight: 47,
    marginTop: 64,
    maxWidth: 330,
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    letterSpacing: -0.24,
    lineHeight: 26,
    marginTop: 22,
    maxWidth: 320,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.58)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 34,
    borderWidth: 1,
    padding: 22,
    shadowColor: "#001E1B",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    height: 58,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  secondaryButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 52,
    paddingTop: 12,
  },
  secondaryMuted: {
    color: colors.muted,
    fontSize: 16,
  },
  secondaryStrong: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.66,
    transform: [{ scale: 0.995 }],
  },
});
