import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import type { AvorynConversationSummary } from "../types/avorynChat";
import { avorynHaptics } from "../utils/avorynHaptics";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const menuItems = [{ icon: "home", label: "Home" }] as const;

type AvorynSideMenuProps = {
  activeConversationId?: string | null;
  conversations?: AvorynConversationSummary[];
  isLoadingConversations?: boolean;
  onNewChat?: () => void;
  onSelectConversation?: (conversationId: string) => void;
};

export function AvorynSideMenu({
  activeConversationId,
  conversations = [],
  isLoadingConversations = false,
  onNewChat,
  onSelectConversation,
}: AvorynSideMenuProps) {
  function handleNewChatPress() {
    avorynHaptics.select();
    onNewChat?.();
  }

  function handleSelectConversation(conversationId: string) {
    avorynHaptics.select();
    onSelectConversation?.(conversationId);
  }

  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <View style={styles.topContent}>
          <Text style={styles.logo}>Avoryn</Text>

          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <Pressable key={item.label} style={styles.menuItem} onPress={avorynHaptics.select}>
                <View style={styles.menuIconWrap}>
                  <Feather name={item.icon} size={28} color={colors.text} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Recent chats</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.historyList}>
              {isLoadingConversations ? (
                <Text style={styles.historyMuted}>Loading chats…</Text>
              ) : conversations.length === 0 ? (
                <Text style={styles.historyMuted}>No chats yet</Text>
              ) : (
                conversations.map((conversation) => {
                  const isActive = conversation.id === activeConversationId;

                  return (
                    <Pressable
                      key={conversation.id}
                      accessibilityRole="button"
                      onPress={() => handleSelectConversation(conversation.id)}
                      style={({ pressed }) => [
                        styles.conversationButton,
                        isActive && styles.activeConversationButton,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        allowFontScaling={false}
                        numberOfLines={2}
                        style={[styles.conversationTitle, isActive && styles.activeConversationTitle]}
                      >
                        {conversation.title}
                      </Text>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.profilePill} onPress={avorynHaptics.select}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <Text style={styles.profileName}>Miro</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Start a new chat"
            accessibilityRole="button"
            style={styles.newChatButton}
            onPress={handleNewChatPress}
          >
            <Feather name="edit-3" size={26} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.drawerBackground,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 44,
    paddingHorizontal: 31,
    paddingTop: 88,
  },
  topContent: {
    flex: 1,
    minHeight: 0,
  },
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 42,
    fontWeight: "400",
    letterSpacing: -1.1,
    marginBottom: 42,
  },
  menuList: {
    gap: 35,
  },
  menuItem: {
    alignItems: "center",
    flexDirection: "row",
  },
  menuIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 26,
    width: 34,
  },
  menuLabel: {
    color: colors.text,
    fontSize: 22,
    letterSpacing: -0.25,
  },
  historySection: {
    flex: 1,
    marginTop: 42,
    minHeight: 0,
    paddingRight: 52,
  },
  historyTitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.9,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  historyList: {
    paddingBottom: 18,
  },
  historyMuted: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
  },
  conversationButton: {
    borderRadius: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  activeConversationButton: {
    backgroundColor: "rgba(255,255,255,0.58)",
    borderColor: "rgba(24,27,26,0.055)",
    borderWidth: 1,
  },
  conversationTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  activeConversationTitle: {
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 58,
  },
  profilePill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 22,
    paddingTop: 10,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#D98324",
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    marginRight: 13,
    width: 40,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  profileName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "500",
  },
  newChatButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
    borderColor: "rgba(24,27,26,0.055)",
    borderRadius: 999,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  pressed: {
    opacity: 0.66,
    transform: [{ scale: 0.995 }],
  },
});
