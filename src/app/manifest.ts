import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calcuva | The Digital Calculator Registry',
    short_name: 'Calcuva',
    description: 'A suite of 50+ beautiful, lightning-fast technical calculators built for finance, health, and mathematics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // zinc-950 (dark mode default)
    theme_color: '#ef4444',     // signal red
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  }
}
