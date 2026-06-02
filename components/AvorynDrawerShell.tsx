import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { Keyboard, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { AvorynConversationSummary } from "../types/avorynChat";
import { avorynHaptics } from "../utils/avorynHaptics";
import { AvorynSideMenu } from "./AvorynSideMenu";

type DrawerControls = {
  closeDrawer: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  toggleDrawer: () => void;
};

type AvorynDrawerShellProps = {
  activeConversationId?: string | null;
  children: (controls: DrawerControls) => ReactNode;
  conversations?: AvorynConversationSummary[];
  gesturesEnabled?: boolean;
  isLoadingConversations?: boolean;
  onNewChat?: () => void;
  onOpenDrawer?: () => void;
  onSelectConversation?: (conversationId: string) => void;
};

const DRAG_ACTIVATION_DISTANCE = 8;
const HORIZONTAL_DOMINANCE = 1.18;
const SWIPE_VELOCITY = 720;
const OPEN_PROGRESS_THRESHOLD = 0.34;
const CLOSE_PROGRESS_THRESHOLD = 0.64;
const MAIN_CARD_OPEN_RADIUS = 34;
const MAIN_CARD_OPEN_SCALE = 0.965;
const DRAWER_PARALLAX_OFFSET = 18;
const OPEN_DISTANCE_RATIO = 0.82;

const OPEN_TIMING = {
  duration: 330,
  easing: Easing.out(Easing.cubic),
};

const CLOSE_TIMING = {
  duration: 255,
  easing: Easing.out(Easing.cubic),
};

const SETTLE_OPEN_TIMING = {
  duration: 235,
  easing: Easing.out(Easing.cubic),
};

const SETTLE_CLOSE_TIMING = {
  duration: 205,
  easing: Easing.out(Easing.cubic),
};

function clamp(value: number, min: number, max: number) {
  "worklet";

  return Math.min(Math.max(value, min), max);
}

export function AvorynDrawerShell({
  activeConversationId,
  children,
  conversations = [],
  gesturesEnabled = true,
  isLoadingConversations = false,
  onNewChat,
  onOpenDrawer,
  onSelectConversation,
}: AvorynDrawerShellProps) {
  const { width } = useWindowDimensions();
  const openDistance = width * OPEN_DISTANCE_RATIO;
  const progress = useSharedValue(0);
  const gestureStartProgress = useSharedValue(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const setOpenState = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
  }, []);

  const triggerDrawerHaptic = useCallback((open: boolean) => {
    if (open) {
      avorynHaptics.openMenu();
      return;
    }

    avorynHaptics.closeMenu();
  }, []);

  const openDrawer = useCallback(() => {
    Keyboard.dismiss();
    onOpenDrawer?.();
    avorynHaptics.openMenu();
    setIsDrawerOpen(true);
    progress.value = withTiming(1, OPEN_TIMING);
  }, [onOpenDrawer, progress]);

  const closeDrawer = useCallback(() => {
    avorynHaptics.closeMenu();
    progress.value = withTiming(0, CLOSE_TIMING, (finished) => {
      if (finished) {
        runOnJS(setOpenState)(false);
      }
    });
  }, [progress, setOpenState]);

  const handleNewChat = useCallback(() => {
    onNewChat?.();
    closeDrawer();
  }, [closeDrawer, onNewChat]);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      onSelectConversation?.(conversationId);
      closeDrawer();
    },
    [closeDrawer, onSelectConversation],
  );

  const toggleDrawer = useCallback(() => {
    if (isDrawerOpen) {
      closeDrawer();
      return;
    }

    openDrawer();
  }, [closeDrawer, isDrawerOpen, openDrawer]);

  const panGesture = Gesture.Pan()
    .enabled(gesturesEnabled)
    .activeOffsetX([-DRAG_ACTIVATION_DISTANCE, DRAG_ACTIVATION_DISTANCE])
    .failOffsetY([-28, 28])
    .onStart(() => {
      gestureStartProgress.value = progress.value;
    })
    .onUpdate((event) => {
      const isMostlyHorizontal = Math.abs(event.translationX) > Math.abs(event.translationY) * HORIZONTAL_DOMINANCE;

      if (!isMostlyHorizontal) {
        return;
      }

      const nextProgress = gestureStartProgress.value + event.translationX / openDistance;
      progress.value = clamp(nextProgress, 0, 1);

      if (progress.value > 0.02) {
        runOnJS(setOpenState)(true);
      }
    })
    .onEnd((event) => {
      const shouldOpen =
        event.velocityX > SWIPE_VELOCITY ||
        (event.velocityX > -SWIPE_VELOCITY && progress.value > OPEN_PROGRESS_THRESHOLD);
      const shouldClose =
        event.velocityX < -SWIPE_VELOCITY ||
        (event.velocityX < SWIPE_VELOCITY && progress.value < CLOSE_PROGRESS_THRESHOLD);
      const nextOpen = progress.value > 0.5 ? !shouldClose : shouldOpen;

      runOnJS(triggerDrawerHaptic)(nextOpen);

      progress.value = withTiming(nextOpen ? 1 : 0, nextOpen ? SETTLE_OPEN_TIMING : SETTLE_CLOSE_TIMING, (finished) => {
        if (finished) {
          runOnJS(setOpenState)(nextOpen);
        }
      });
    });

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.86 + progress.value * 0.14,
    transform: [{ translateX: (progress.value - 1) * DRAWER_PARALLAX_OFFSET }],
  }));

  const mainCardAnimatedStyle = useAnimatedStyle(() => {
    const scale = 1 - progress.value * (1 - MAIN_CARD_OPEN_SCALE);

    return {
      shadowOpacity: progress.value * 0.18,
      shadowRadius: 30 * progress.value,
      transform: [
        { translateX: progress.value * openDistance },
        { scale },
      ],
    };
  });

  const mainScreenAnimatedStyle = useAnimatedStyle(() => {
    const radius = progress.value * MAIN_CARD_OPEN_RADIUS;

    return {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.shell}>
        <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
          <AvorynSideMenu
            activeConversationId={activeConversationId}
            conversations={conversations}
            isLoadingConversations={isLoadingConversations}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
          />
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={[styles.mainCard, mainCardAnimatedStyle]}>
          <Animated.View style={[styles.mainScreen, mainScreenAnimatedStyle]}>
            {children({ closeDrawer, isDrawerOpen, openDrawer, toggleDrawer })}
          </Animated.View>

          {isDrawerOpen ? (
            <Pressable
              accessibilityLabel="Close menu"
              accessibilityRole="button"
              onPress={closeDrawer}
              style={styles.closeLayer}
            />
          ) : null}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: "#F5F8F2",
    flex: 1,
    overflow: "hidden",
  },
  drawer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F5F8F2",
    zIndex: 10,
  },
  mainCard: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    elevation: 20,
    shadowColor: "#001E1B",
    shadowOffset: { width: -8, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    zIndex: 30,
  },
  mainScreen: {
    backgroundColor: "#F5F8F2",
    flex: 1,
    overflow: "hidden",
  },
  closeLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});
