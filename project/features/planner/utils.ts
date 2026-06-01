export function getDayLabel(
  days: number
): { title: string; subtitle: string } | null {
  const map: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: "1 día",
      subtitle: "Perfecto para una escapada rápida",
    },
    2: {
      title: "2 días",
      subtitle: "Un fin de semana bien aprovechado",
    },
    3: {
      title: "3 días",
      subtitle: "Ideal para conocer lo esencial",
    },
    4: {
      title: "4 días",
      subtitle: "Tiempo suficiente para relajarte",
    },
    5: {
      title: "5 días",
      subtitle: "Una semana casi completa de aventura",
    },
    6: {
      title: "6 días",
      subtitle: "Explora cada rincón con calma",
    },
    7: {
      title: "7 días",
      subtitle: "La semana perfecta para descubrir la región",
    },
    8: {
      title: "8 días",
      subtitle: "Sumérgete de verdad en la cultura local",
    },
    9: {
      title: "9 días",
      subtitle: "Vive la experiencia a fondo",
    },
    10: {
      title: "10 días",
      subtitle: "Una aventura completa e inolvidable",
    },
  };

  return map[days] ?? null;
}
