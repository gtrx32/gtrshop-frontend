// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    runtimeConfig: {
        public: {
            backendUrl: process.env.BACKEND_URL,
            yandexMapsKey: process.env.YANDEX_MAPS_KEY,
        },
    },
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'GtrShop',
        },
    },
    vite: {
        plugins: [tailwindcss()]
    },
    css: ['~/assets/css/main.css', '~/assets/css/fonts.css'],
    modules: ['@nuxt/icon', '@nuxt/ui', '@pinia/nuxt'],
    ui: {
        fonts: false,
    },
});