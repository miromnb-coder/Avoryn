import * as Haptics from "expo-haptics";

async function safelyRunHaptic(action: () => Promise<void>) {
  try {
    await action();
  } catch {
    // Haptics may be unavailable on some devices or simulators.
  }
}

export const avorynHaptics = {
  openMenu() {
    return safelyRunHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  },
  closeMenu() {
    return safelyRunHaptic(() => Haptics.selectionAsync());
  },
  select() {
    return safelyRunHaptic(() => Haptics.selectionAsync());
  },
  success() {
    return safelyRunHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  },
};
