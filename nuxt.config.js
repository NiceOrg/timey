export default {
  server: {
    port: 8000, // default: 3000
  },
  target: 'static',
  env: {
    api: 'http://localhost:8001/',
  },
  head: {
    title: 'timey',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['ant-design-vue/dist/antd.css', '@/assets/styles/main.css'],
  plugins: ['@/plugins/antd-ui'],
  components: true,
  buildModules: ['@nuxt/typescript-build'],
  modules: ['@nuxtjs/pwa'],
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
  build: {},
}
