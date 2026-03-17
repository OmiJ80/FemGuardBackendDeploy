import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'PCOS & Fertility Tracker',
                short_name: 'PCOS PWA',
                description: 'Early Risk Screening & Preventive Self-Care Tool for PCOS & Fertility',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml'
                    },
                    {
                        src: 'pwa-512x512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ]
});
