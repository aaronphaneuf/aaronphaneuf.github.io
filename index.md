---
title: Articles
aside: false
class: centered
---

<script setup>
import { groups } from '/.vitepress/posts.data.client'
</script>

Hello! I'm Aaron Phaneuf. This is my digital garden and cozy corner of the internet. You can learn more about me [here](/about). If you get lost, here-bot cat will help you find your way:

::: herebot Hi, I'm the here-bot cat!
Use me to find your way in my website.

**Here I am:**
`/` (root)
:::

<!--
::: birdbot "You spotted a Snowy Owl!"
There was a **1 in 50** chance of this occurring.

<a class="birdbot-save" href="#">Save this spot here</a>
:::
-->

> Stuck in a git garden where nothing merges, everything grows wild, and every pull request feels like allergy season. 🌿
<br>

<br>

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


