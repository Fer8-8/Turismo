export type Place = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
};

export type CityKey = "CDMX" | "Guadalajara" | "Monterrey";

export const CITIES_DATA: Record<CityKey, Place[]> = {
  Monterrey: [
    {
      id: "1",
      title: "Linares",
      subtitle: "Nuevo León",
      imageUrl:
        "https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "2",
      title: "Linares",
      subtitle: "Nuevo León",
      imageUrl:
        "https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "3",
      title: "Linares",
      subtitle: "Nuevo León",
      imageUrl:
        "https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "4",
      title: "Linares",
      subtitle: "Nuevo León",
      imageUrl:
        "https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "5",
      title: "Linares",
      subtitle: "Nuevo León",
      imageUrl:
        "https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "6",
      title: "Linares",
      subtitle: "Nuevo León",
      imageUrl:
        "https://images.unsplash.com/photo-1773929483999-52ac8e6af2cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  Guadalajara: [
    {
      id: "1",
      title: "Linares",
      subtitle: "Guadalajara",
      imageUrl:
        "https://images.unsplash.com/photo-1773820681050-0a836221436a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "2",
      title: "Linares",
      subtitle: "Guadalajara",
      imageUrl:
        "https://images.unsplash.com/photo-1773820681050-0a836221436a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "3",
      title: "Linares",
      subtitle: "Guadalajara",
      imageUrl:
        "https://images.unsplash.com/photo-1773820681050-0a836221436a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "4",
      title: "Linares",
      subtitle: "Guadalajara",
      imageUrl:
        "https://images.unsplash.com/photo-1773820681050-0a836221436a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "5",
      title: "Linares",
      subtitle: "Guadalajara",
      imageUrl:
        "https://images.unsplash.com/photo-1773820681050-0a836221436a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "6",
      title: "Linares",
      subtitle: "Guadalajara",
      imageUrl:
        "https://images.unsplash.com/photo-1773820681050-0a836221436a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
  CDMX: [
    {
      id: "1",
      title: "Linares",
      subtitle: "CDMX",
      imageUrl:
        "https://images.unsplash.com/photo-1773176637844-afc26168ba78?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "2",
      title: "Linares",
      subtitle: "CDMX",
      imageUrl:
        "https://images.unsplash.com/photo-1773176637844-afc26168ba78?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "3",
      title: "Linares",
      subtitle: "CDMX",
      imageUrl:
        "https://images.unsplash.com/photo-1773176637844-afc26168ba78?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "4",
      title: "Linares",
      subtitle: "CDMX",
      imageUrl:
        "https://images.unsplash.com/photo-1773176637844-afc26168ba78?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "5",
      title: "Linares",
      subtitle: "CDMX",
      imageUrl:
        "https://images.unsplash.com/photo-1773176637844-afc26168ba78?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "6",
      title: "Linares",
      subtitle: "CDMX",
      imageUrl:
        "https://images.unsplash.com/photo-1773176637844-afc26168ba78?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
};
