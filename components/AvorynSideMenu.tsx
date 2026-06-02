import { Feather } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { avorynHaptics } from "../utils/avorynHaptics";

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const menuItems = [{ icon: "home", label: "Home" }] as const;

export function AvorynSideMenu() {
  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <View>
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
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.profilePill} onPress={avorynHaptics.select}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>M</Text>
            </View>
            <Text style={styles.profileName}>Miro</Text>
          </Pressable>

          <Pressable style={styles.newChatButton} onPress={avorynHaptics.select}>
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
});
