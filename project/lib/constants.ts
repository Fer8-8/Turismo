import { Dimensions } from "react-native";

export const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const MEXICO_STATES = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
] as const;

export type MexicoState = (typeof MEXICO_STATES)[number];

export const IMAGE_PLACEHOLDER = "https://placehold.co/600x800?text=mexico";
export const QUERY_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const QUERY_VIDEO_MIME_TYPES = ["video/mp4", "video/mpeg", "video/webm"];
