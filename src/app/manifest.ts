import { MetadataRoute } from 'next'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} | The Digital Calculator Registry`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // zinc-950 (dark mode default)
    theme_color: '#ef4444',     // signal red
    icons: [
      {
        src: '/favicon-concept.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-concept.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon-concept.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/favicon-concept.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  }
}
