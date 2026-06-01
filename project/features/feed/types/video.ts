export const PLACEHOLDER_VIDEO_DATA = [
  {
    id: 1,
    title: "Hotel Mar Azul Cancún",
    description:
      "A beachfront luxury hotel with ocean views, infinity pools, and direct access to white sand beaches.",
    price: 320,
    video:
      "https://bucket.emmanuelbayona.dev/tourism-test/4434136-uhd_2160_3840_30fps.mp4",
    location: "Cancún, Mex.",
  },
  {
    id: 2,
    title: "Sierra Norte Grand Hotel",
    description:
      "Modern comfort in the heart of the city, featuring panoramic mountain views and fine dining experiences.",
    price: 210,
    video:
      "https://bucket.emmanuelbayona.dev/tourism-test/4434242-uhd_2160_3840_24fps.mp4",
    location: "Monterrey, Mex.",
  },
  {
    id: 3,
    title: "Casa del Sol Boutique Hotel",
    description:
      "A charming boutique hotel blending colonial architecture with contemporary design and local art.",
    price: 185,
    video:
      "https://bucket.emmanuelbayona.dev/tourism-test/4678261-hd_1080_1920_25fps.mp4",
    location: "Guadalajara, Mex.",
  },
  {
    id: 4,
    title: "Hacienda Real Durango",
    description:
      "An elegant historic hacienda offering spacious rooms, tranquil gardens, and traditional Mexican cuisine.",
    price: 160,
    video:
      "https://bucket.emmanuelbayona.dev/tourism-test/5595352-hd_1080_1920_24fps.mp4",
    location: "Durango, Mex.",
  },
  {
    id: 5,
    title: "Cobre Valley Resort",
    description:
      "A peaceful mountain retreat surrounded by nature, perfect for relaxation and outdoor adventures.",
    price: 140,
    video:
      "https://bucket.emmanuelbayona.dev/tourism-test/5893890-hd_1080_1920_24fps.mp4",
    location: "Chihuahua, Mex.",
  },
];

export type Video = (typeof PLACEHOLDER_VIDEO_DATA)[number];
