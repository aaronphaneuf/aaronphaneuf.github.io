import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import '@catppuccin/vitepress/theme/mocha/mauve.css' // or your flavor/accent
import './style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

export default {
  ...DefaultTheme,
  Layout
}
