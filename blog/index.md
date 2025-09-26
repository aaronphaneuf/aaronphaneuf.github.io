---
title: Articles
---

<script setup>
import { groups } from '/.vitepress/posts.data.client'
</script>
# Articles

<div class="archive">
  <template v-for="group in groups" :key="group.label">
    <h2 class="archive__month">{{ group.label }}</h2>
    <ul class="archive__list">
  <li v-for="post in group.items" :key="post.href">
    <a class="archive__link" :href="post.href">
      {{ post.title }}
    </a>
  </li>
</ul>  </template>
</div>

