import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SPACING, THEME } from "@/lib/theme";
import { AnimatedModalContent } from "@/navigation/components/animated-modal-content";
import { DetachedModalHeader } from "@/navigation/components/detached-modal-header";

const statusOptions = [
  { value: "all", label: "Todos", icon: "list-unordered" },
  { value: "active", label: "Activos", icon: "check-circle" },
  { value: "expired", label: "Expirados", icon: "clock" },
];

const typeOptions = [
  { value: "all", label: "Todos", icon: "apps" },
  { value: "explore", label: "Explorar", icon: "location" },
  { value: "route", label: "Ruta", icon: "git-compare" },
];

export function PlansFilters() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  return (
    <AnimatedModalContent>
      <DetachedModalHeader title="Filtrar" />
      <View style={styles.container}>
        <View style={styles.filterSection}>
          <Text variant="caption">Estado</Text>
          <View style={styles.optionsRow}>
            {statusOptions.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedStatus(option.value)}
                  style={styles.option}
                >
                  <Octicons
                    color={isSelected ? "#007AFF" : "#999"}
                    name={option.icon}
                    size={24}
                    style={styles.icon}
                  />
                  <Text color={isSelected ? "title" : "muted"}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text variant="caption">Tipo</Text>
          <View style={styles.optionsRow}>
            {typeOptions.map((option) => {
              const isSelected = selectedType === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSelectedType(option.value)}
                  style={styles.option}
                >
                  <Octicons
                    color={isSelected ? "#007AFF" : "#999"}
                    name={option.icon}
                    size={24}
                    style={styles.icon}
                  />
                  <Text color={isSelected ? "title" : "muted"}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </AnimatedModalContent>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  filterSection: {
    marginBottom: SPACING.lg,
  },
  optionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  option: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${THEME.surface}80`,
  },
  icon: {
    marginBottom: SPACING.xs,
  },
});
