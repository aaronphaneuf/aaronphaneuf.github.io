import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

export default defineConfig({
  base: '/',
  title: "Aaron's space",
  description: 'Built with VitePress + Catppuccin',

  head: [
    // Font Awesome
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        integrity: 'sha512-Mv93VfO0oH4XnCwS95cKf9mA3g7p4zU/4D95qQ1SZVrs9FsyIrCKwO5F3+mHkz2VXGjBq69yXzI6oMw6L3xZ7g==',
        crossorigin: 'anonymous',
        referrerpolicy: 'no-referrer'
      }
    ],
    // Playfair Display
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap'
      }
    ]
  ],

  appearance: false,

  themeConfig: {
    nav: [],
    outline: { level: [2, 3], label: 'On this page' },
    sidebar: false,
  },

  markdown: {
    config: (md) => {

      // HEREBOT
      md.use(container, 'herebot', {
        render(tokens, idx) {
          const token = tokens[idx]

          if (token.nesting === 1) {
            const info = token.info.trim().slice('herebot'.length).trim()
            const unquoted = info.replace(/^"(.*)"$|^'(.*)'$/, '$1$2')
            const summary = unquoted || "Hi, I'm the here-bot cat!"

            return `<details class="herebot" v-pre>
<summary>
<i class="fa-solid fa-cat fa-lg"></i>
${md.utils.escapeHtml(summary)}
</summary>\n`
          } else {
            return `</details>\n`
          }
        }
      })

      // BIRDBOT
      md.use(container, 'birdbot', {
        render(tokens, idx) {
          const token = tokens[idx]

          if (token.nesting === 1) {
            const info = token.info.trim().slice('birdbot'.length).trim()
            const unquoted = info.replace(/^"(.*)"$|^'(.*)'$/, '$1$2')
            const summary = unquoted || "Bird Bot encounter!"

            return `<details class="birdbot" v-pre>
<summary>
<i class="fa-solid fa-dove fa-lg"></i>
${md.utils.escapeHtml(summary)}
</summary>\n`
          } else {
            return `</details>\n`
          }
        }
      })

    }
  }
})
