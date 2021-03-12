export default {
  target: 'static',
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
