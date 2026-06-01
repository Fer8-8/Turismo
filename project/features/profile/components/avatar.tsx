import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SPACING } from "@/lib/theme";

type AvatarProps = {
  isUserAnonymous: boolean;
  name: string;
  email: string;
};

export function Avatar({ isUserAnonymous, name, email }: AvatarProps) {
  const router = useRouter();

  function handleCreateAccountRedirect() {
    router.push("/(tabs)/options/sign-up");
  }

  return (
    <>
      {isUserAnonymous ? (
        <>
          <View style={styles.anonymousAvatarContainer}>
            <Image
              contentFit="cover"
              source={require("@/assets/images/logos/explore-mx-logo.png")}
              style={styles.anonymousAvatar}
            />
          </View>

          <Text align="center" style={styles.name} variant="bodySmall">
            Crea tu cuenta y empieza a explorar con una experiencia hecha para
            ti
          </Text>

          <Button
            onPress={handleCreateAccountRedirect}
            style={styles.createAccountButton}
          >
            Crea cuenta
          </Button>
        </>
      ) : (
        <>
          <Image
            contentFit="cover"
            source={{
              uri: "https://images.unsplash.com/photo-1694698955114-82c37b89f961?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={styles.avatar}
          />

          <Text align="center" style={styles.name} variant="title">
            {name}
          </Text>

          <Text align="center" variant="body">
            {email}
          </Text>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  anonymousAvatarContainer: {
    backgroundColor: "#ffffff",
    width: 130,
    height: 130,
    marginHorizontal: "auto",
    marginTop: SPACING.md,
    borderRadius: 65,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  anonymousAvatar: {
    width: 120,
    height: 90,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginHorizontal: "auto",
    marginTop: SPACING.md,
  },
  name: {
    marginTop: SPACING.md,
  },
  createAccountButton: {
    marginTop: SPACING.md,
  },
});
