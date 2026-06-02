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
import { AvorynTravelCockpit } from "./AvorynTravelCockpit";

type ActivePanel = "left" | "right" | null;

type DrawerControls = {
  closeDrawer: () => void;
  closePanels: () => void;
  isCockpitOpen: boolean;
  isDrawerOpen: boolean;
  openCockpit: () => void;
  openDrawer: () => void;
  toggleCockpit: () => void;
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
const MAIN_CARD_OPEN_RADIUS = 34;
const MAIN_CARD_OPEN_SCALE = 0.965;
const PANEL_PARALLAX_OFFSET = 18;
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
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const isDrawerOpen = activePanel === "left";
  const isCockpitOpen = activePanel === "right";

  const setPanelState = useCallback((panel: ActivePanel) => {
    setActivePanel(panel);
  }, []);

  const triggerPanelHaptic = useCallback((panel: ActivePanel) => {
    if (panel) {
      avorynHaptics.openMenu();
      return;
    }

    avorynHaptics.closeMenu();
  }, []);

  const closePanels = useCallback(() => {
    avorynHaptics.closeMenu();
    progress.value = withTiming(0, CLOSE_TIMING, (finished) => {
      if (finished) {
        runOnJS(setPanelState)(null);
      }
    });
  }, [progress, setPanelState]);

  const openDrawer = useCallback(() => {
    Keyboard.dismiss();
    onOpenDrawer?.();
    avorynHaptics.openMenu();
    setActivePanel("left");
    progress.value = withTiming(1, OPEN_TIMING);
  }, [onOpenDrawer, progress]);

  const openCockpit = useCallback(() => {
    Keyboard.dismiss();
    avorynHaptics.openMenu();
    setActivePanel("right");
    progress.value = withTiming(-1, OPEN_TIMING);
  }, [progress]);

  const closeDrawer = closePanels;

  const handleNewChat = useCallback(() => {
    onNewChat?.();
    closePanels();
  }, [closePanels, onNewChat]);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      onSelectConversation?.(conversationId);
      closePanels();
    },
    [closePanels, onSelectConversation],
  );

  const toggleDrawer = useCallback(() => {
    if (isDrawerOpen) {
      closePanels();
      return;
    }

    openDrawer();
  }, [closePanels, isDrawerOpen, openDrawer]);

  const toggleCockpit = useCallback(() => {
    if (isCockpitOpen) {
      closePanels();
      return;
    }

    openCockpit();
  }, [closePanels, isCockpitOpen, openCockpit]);

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
      progress.value = clamp(nextProgress, -1, 1);

      if (progress.value > 0.02) {
        runOnJS(setPanelState)("left");
      }

      if (progress.value < -0.02) {
        runOnJS(setPanelState)("right");
      }
    })
    .onEnd((event) => {
      let targetProgress = 0;
      let nextPanel: ActivePanel = null;

      if (event.velocityX > SWIPE_VELOCITY || progress.value > OPEN_PROGRESS_THRESHOLD) {
        targetProgress = 1;
        nextPanel = "left";
      }

      if (event.velocityX < -SWIPE_VELOCITY || progress.value < -OPEN_PROGRESS_THRESHOLD) {
        targetProgress = -1;
        nextPanel = "right";
      }

      runOnJS(triggerPanelHaptic)(nextPanel);

      progress.value = withTiming(targetProgress, nextPanel ? SETTLE_OPEN_TIMING : SETTLE_CLOSE_TIMING, (finished) => {
        if (finished) {
          runOnJS(setPanelState)(nextPanel);
        }
      });
    });

  const leftPanelAnimatedStyle = useAnimatedStyle(() => {
    const leftProgress = Math.max(progress.value, 0);

    return {
      opacity: 0.86 + leftProgress * 0.14,
      transform: [{ translateX: (leftProgress - 1) * PANEL_PARALLAX_OFFSET }],
    };
  });

  const rightPanelAnimatedStyle = useAnimatedStyle(() => {
    const rightProgress = Math.max(-progress.value, 0);

    return {
      opacity: 0.86 + rightProgress * 0.14,
      transform: [{ translateX: (1 - rightProgress) * PANEL_PARALLAX_OFFSET }],
    };
  });

  const mainCardAnimatedStyle = useAnimatedStyle(() => {
    const absoluteProgress = Math.abs(progress.value);
    const scale = 1 - absoluteProgress * (1 - MAIN_CARD_OPEN_SCALE);

    return {
      shadowOpacity: absoluteProgress * 0.18,
      shadowRadius: 30 * absoluteProgress,
      transform: [
        { translateX: progress.value * openDistance },
        { scale },
      ],
    };
  });

  const mainScreenAnimatedStyle = useAnimatedStyle(() => {
    const leftRadius = Math.max(progress.value, 0) * MAIN_CARD_OPEN_RADIUS;
    const rightRadius = Math.max(-progress.value, 0) * MAIN_CARD_OPEN_RADIUS;

    return {
      borderTopLeftRadius: leftRadius,
      borderBottomLeftRadius: leftRadius,
      borderTopRightRadius: rightRadius,
      borderBottomRightRadius: rightRadius,
    };
  });

  const mainCardShadowStyle = useAnimatedStyle(() => {
    const shadowOffsetX = progress.value < 0 ? 8 : -8;

    return {
      shadowOffset: { width: shadowOffsetX, height: 0 },
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.shell}>
        <Animated.View style={[styles.leftPanel, leftPanelAnimatedStyle]}>
          <AvorynSideMenu
            activeConversationId={activeConversationId}
            conversations={conversations}
            isLoadingConversations={isLoadingConversations}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
          />
        </Animated.View>

        <Animated.View style={[styles.rightPanel, rightPanelAnimatedStyle]}>
          <AvorynTravelCockpit />
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={[styles.mainCard, mainCardAnimatedStyle, mainCardShadowStyle]}>
          <Animated.View style={[styles.mainScreen, mainScreenAnimatedStyle]}>
            {children({
              closeDrawer,
              closePanels,
              isCockpitOpen,
              isDrawerOpen,
              openCockpit,
              openDrawer,
              toggleCockpit,
              toggleDrawer,
            })}
          </Animated.View>

          {activePanel ? (
            <Pressable
              accessibilityLabel="Close panel"
              accessibilityRole="button"
              onPress={closePanels}
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
  leftPanel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F5F8F2",
    zIndex: 10,
  },
  rightPanel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F5F8F2",
    zIndex: 20,
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
