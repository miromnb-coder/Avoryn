import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { hasSupabaseConfig, supabase } from "../../lib/supabase";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

type AvorynEmailAuthScreenProps = {
  onBack: () => void;
  onSignedIn?: () => void;
};

type AuthNotice = {
  message: string;
  tone: "error" | "neutral" | "success";
} | null;

type PendingAction = "continue" | "create" | "reset" | null;

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "Something went wrong. Please try again.");
  const normalized = message.toLowerCase();

  if (normalized.includes("network request failed") || normalized.includes("failed to fetch")) {
    return "Cannot reach Avoryn Cloud. Check your connection and try again.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Wrong password or account not found. If you are new, tap Create account.";
  }

  if (normalized.includes("email not confirmed") || normalized.includes("not confirmed")) {
    return "This email is not confirmed yet. Check your email first, then try again.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "This email already has an account. Use Continue to sign in.";
  }

  if (normalized.includes("rate")) {
    return "Too many attempts. Wait a moment and try again.";
  }

  return message;
}

export function AvorynEmailAuthScreen({ onBack, onSignedIn }: AvorynEmailAuthScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notice, setNotice] = useState<AuthNotice>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const cleanEmail = email.trim().toLowerCase();
  const isBusy = pendingAction !== null;

  const clearError = () => {
    if (notice?.tone === "error") {
      setNotice(null);
    }
  };

  const validateSupabase = () => {
    if (!hasSupabaseConfig) {
      setNotice({ tone: "error", message: "Supabase is not configured. Check your Expo environment variables." });
      return false;
    }

    return true;
  };

  const validateEmail = () => {
    if (!isValidEmail(cleanEmail)) {
      setNotice({ tone: "error", message: "Enter a valid email address." });
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setNotice({ tone: "error", message: "Password must be at least 6 characters." });
      return false;
    }

    return true;
  };

  const continueWithEmail = async () => {
    if (isBusy || !validateSupabase() || !validateEmail() || !validatePassword()) {
      return;
    }

    Keyboard.dismiss();
    setPendingAction("continue");
    setNotice({ tone: "neutral", message: "Signing in..." });

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

      if (error) {
        throw error;
      }

      setNotice({ tone: "success", message: "Signed in. Opening Avoryn..." });
      onSignedIn?.();
    } catch (error) {
      setNotice({ tone: "error", message: getAuthErrorMessage(error) });
    } finally {
      setPendingAction(null);
    }
  };

  const createAccount = async () => {
    if (isBusy || !validateSupabase() || !validateEmail() || !validatePassword()) {
      return;
    }

    Keyboard.dismiss();
    setPendingAction("create");
    setNotice({ tone: "neutral", message: "Creating your account..." });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { app_name: "Avoryn" } },
      });

      if (error) {
        throw error;
      }

      const identities = data.user?.identities;
      if (Array.isArray(identities) && identities.length === 0) {
        setNotice({ tone: "error", message: "This email already has an account. Use Continue to sign in." });
        return;
      }

      if (data.session) {
        setNotice({ tone: "success", message: "Account created. Opening Avoryn..." });
        onSignedIn?.();
      } else {
        setNotice({ tone: "success", message: "Account created. Check your email once, then return here and press Continue." });
      }
    } catch (error) {
      setNotice({ tone: "error", message: getAuthErrorMessage(error) });
    } finally {
      setPendingAction(null);
    }
  };

  const sendPasswordReset = async () => {
    if (isBusy || !validateSupabase() || !validateEmail()) {
      return;
    }

    Keyboard.dismiss();
    setPendingAction("reset");
    setNotice({ tone: "neutral", message: "Sending password reset email..." });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      if (error) {
        throw error;
      }

      setNotice({ tone: "success", message: "Password reset email sent. Check your inbox." });
    } catch (error) {
      setNotice({ tone: "error", message: getAuthErrorMessage(error) });
    } finally {
      setPendingAction(null);
    }
  };

  const goBack = () => {
    Keyboard.dismiss();
    onBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <View style={styles.hero}>
              <Text allowFontScaling={false} style={styles.logo}>
                Avoryn
              </Text>
              <Text allowFontScaling={false} style={styles.title}>
                Continue with Email
              </Text>
              <Text allowFontScaling={false} style={styles.subtitle}>
                Sign in or create your account to keep Avoryn personal to you.
              </Text>
            </View>

            <View style={styles.formCard}>
              <Text allowFontScaling={false} style={styles.label}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  clearError();
                }}
                placeholder="you@example.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isBusy}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                style={styles.input}
              />

              <Text allowFontScaling={false} style={[styles.label, styles.passwordLabel]}>
                Password
              </Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    clearError();
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!passwordVisible}
                  textContentType="password"
                  autoComplete="current-password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isBusy}
                  returnKeyType="done"
                  onSubmitEditing={continueWithEmail}
                  style={styles.passwordInput}
                />
                <Pressable
                  accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                  disabled={isBusy}
                  hitSlop={12}
                  onPress={() => setPasswordVisible((current) => !current)}
                  style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}
                >
                  <Feather name={passwordVisible ? "eye-off" : "eye"} size={23} color={colors.muted} />
                </Pressable>
              </View>

              <Pressable
                disabled={isBusy}
                onPress={sendPasswordReset}
                style={({ pressed }) => [styles.forgotButton, pressed && styles.pressed, isBusy && styles.disabled]}
              >
                <Text allowFontScaling={false} style={styles.forgotText}>
                  {pendingAction === "reset" ? "Sending..." : "Forgot password?"}
                </Text>
              </Pressable>

              {notice ? <Text allowFontScaling={false} style={[styles.noticeText, styles[notice.tone]]}>{notice.message}</Text> : null}

              <Pressable
                disabled={isBusy}
                onPress={continueWithEmail}
                style={({ pressed }) => [styles.continueButton, pressed && styles.pressed, isBusy && styles.disabled]}
              >
                <Text allowFontScaling={false} style={styles.continueText}>
                  {pendingAction === "continue" ? "Please wait..." : "Continue"}
                </Text>
              </Pressable>

              <Pressable
                disabled={isBusy}
                onPress={createAccount}
                style={({ pressed }) => [styles.createButton, pressed && styles.pressed, isBusy && styles.disabled]}
              >
                <Text allowFontScaling={false} style={styles.createText}>
                  {pendingAction === "create" ? "Creating..." : "Create account"}
                </Text>
              </Pressable>

              <Pressable disabled={isBusy} onPress={goBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <View style={styles.backLine} />
                <Text allowFontScaling={false} style={styles.backText}>
                  Back
                </Text>
                <View style={styles.backLine} />
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.drawerBackground,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 28,
    paddingHorizontal: 28,
    paddingTop: 70,
  },
  hero: {
    alignItems: "center",
  },
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: -1.05,
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 37,
    fontWeight: "400",
    letterSpacing: -1.05,
    lineHeight: 44,
    marginTop: 34,
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    letterSpacing: -0.22,
    lineHeight: 25,
    marginTop: 14,
    maxWidth: 310,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.58)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 34,
    borderWidth: 1,
    paddingBottom: 18,
    paddingHorizontal: 24,
    paddingTop: 25,
    shadowColor: "#001E1B",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.16,
  },
  passwordLabel: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text,
    fontSize: 17,
    height: 54,
    marginTop: 10,
    paddingHorizontal: 17,
  },
  passwordWrap: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    height: 54,
    marginTop: 10,
  },
  passwordInput: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    height: "100%",
    paddingLeft: 17,
    paddingRight: 8,
  },
  eyeButton: {
    alignItems: "center",
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    marginTop: 10,
  },
  forgotText: {
    color: colors.muted,
    fontSize: 15,
  },
  noticeText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  error: {
    color: "#9F3434",
  },
  neutral: {
    color: colors.muted,
  },
  success: {
    color: colors.success,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 16,
    height: 54,
    justifyContent: "center",
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  createButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.74)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 16,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    marginTop: 12,
  },
  createText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 24,
  },
  backLine: {
    backgroundColor: "rgba(24,27,26,0.08)",
    flex: 1,
    height: 1,
  },
  backText: {
    color: colors.muted,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.62,
  },
  pressed: {
    opacity: 0.66,
    transform: [{ scale: 0.995 }],
  },
});
