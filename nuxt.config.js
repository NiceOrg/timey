export default {
  server: {
    port: 8000, // default: 3000
  },
  target: 'static',
  ssr: false,
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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=New+Tegomin&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital@1&display=swap',
      },
    ],
  },
  css: ['ant-design-vue/dist/antd.css', '@/assets/styles/main.css'],
  plugins: ['@/plugins/antd-ui', '@/plugins/tasks.client', '@/plugins/timer.client', '@/plugins/tags.client'],
  components: true,
  buildModules: ['@nuxt/typescript-build'],
  modules: ['@nuxtjs/pwa'],
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
}
