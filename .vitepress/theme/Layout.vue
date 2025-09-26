<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { withBase, useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

// footer illustration (file must be at /public/footer-left.png)
const illo = withBase('/footer-left.png')

const resolveCover = (src?: string) => {
  if (!src) return ''
  return src.startsWith('/') ? withBase(src) : src
}

// ISO → DD·MM·YYYY
const formattedDate = computed(() => {
  const raw = frontmatter.value.date as string | undefined
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(+d)) return raw
  return d
    .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '·')
})
</script>

<template>
  <Layout>
    <!-- Post header (only on /posts/*) -->
    <template #doc-before>
      <div v-if="(route.path.startsWith('/posts/') || frontmatter.showCover) && frontmatter.cover">
        <h1 class="post-title">{{ frontmatter.title }}</h1>
        <p v-if="frontmatter.date" class="post-date">{{ formattedDate }}</p>

        <div v-if="frontmatter.cover" class="post-cover-wrap">
          <img
            class="post-cover"
            :src="resolveCover(frontmatter.cover as string)"
            :alt="(frontmatter.coverAlt as string) || (frontmatter.title as string) || ''"
          />
        </div>
      </div>
    </template>

    <!-- ✅ Restore footer -->
    <template #layout-bottom>
      <img class="footer-illo" :src="illo" alt="" width="300" height="300" />
      <div class="footer-spacer" aria-hidden="true"></div>
      <footer class="footer">
        <div class="footer-rule" aria-hidden="true"></div>
        <small>
		By Aaron — <a href="/contact/">Contact</a>
        </small>
      </footer>
    </template>
  </Layout>
</template>

