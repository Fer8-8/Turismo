import {
  ImpactFeedbackStyle,
  impactAsync,
  NotificationFeedbackType,
  notificationAsync,
} from "expo-haptics";

export const haptics = {
  tap: () => impactAsync(ImpactFeedbackStyle.Light),
  confirm: () => impactAsync(ImpactFeedbackStyle.Medium),
  success: () => notificationAsync(NotificationFeedbackType.Success),
  error: () => notificationAsync(NotificationFeedbackType.Error),
};
