<template>
  <section class="board-game-shelf-page">
    <div
      v-for="(games, shelfName) in groupedShelves"
      :key="shelfName"
      class="shelf-block"
    >
      <div class="shelf-header">
        <h2>{{ shelfName }}</h2>
        <div class="shelf-decoration" aria-hidden="true">
          <span class="plant-stem"></span>
          <span class="plant-leaf leaf-1"></span>
          <span class="plant-leaf leaf-2"></span>
        </div>
      </div>

      <div class="shelf-scroll">
        <div class="shelf-row">
          <div
            v-for="game in games"
            :key="game.title"
            class="game-wrapper"
          >
            <button
              class="game-spine"
              :class="{
                'has-accent': !!game.accentColor,
                'is-active': activeGame?.title === game.title
              }"
              :style="spineStyle(game)"
              @mouseenter="handleHover(game)"
              @mouseleave="handleLeave"
              @focus="setActive(game)"
              @blur="clearActive"
              @click="toggleActive(game)"
              type="button"
            >
              <span
                v-if="game.accentColor"
                class="watercolor-accent"
                :style="{ background: game.accentColor }"
                aria-hidden="true"
              ></span>

              <span class="spine-inner">
                <span class="spine-title">{{ game.title }}</span>
              </span>
            </button>

            <!-- Desktop floating card only -->
            <transition name="detail-fade">
              <div
                v-if="!isMobile && activeGame?.title === game.title"
                class="game-detail-card desktop-card"
              >
                <div class="detail-title">{{ game.title }}</div>

                <div class="detail-meta-row">
                  <span class="detail-label">Players</span>
                  <span class="detail-value">{{ game.stats.players }}</span>
                </div>

                <div class="detail-meta-row">
                  <span class="detail-label">Play Time</span>
                  <span class="detail-value">{{ game.stats.playtime }}</span>
                </div>

                <div class="detail-meta-row">
                  <span class="detail-label">BGG</span>
                  <span class="detail-value">{{ game.bgg ?? '—' }}</span>
                </div>

                <div class="detail-divider"></div>

                <p v-if="game.notes" class="detail-notes">
                  {{ game.notes }}
                </p>
              </div>
            </transition>
          </div>

          <div class="shelf-endcap" aria-hidden="true"></div>
        </div>

        <div class="shelf-line" aria-hidden="true"></div>
      </div>

      <!-- Mobile inline panel -->
      <transition name="detail-fade">
        <div
          v-if="isMobile && activeShelfGame(shelfName)"
          class="game-detail-card mobile-inline-card"
        >
          <div class="detail-title">{{ activeShelfGame(shelfName).title }}</div>

          <div class="detail-meta-row">
            <span class="detail-label">Players</span>
            <span class="detail-value">{{ activeShelfGame(shelfName).stats.players }}</span>
          </div>

          <div class="detail-meta-row">
            <span class="detail-label">Play Time</span>
            <span class="detail-value">{{ activeShelfGame(shelfName).stats.playtime }}</span>
          </div>

          <div class="detail-meta-row">
            <span class="detail-label">BGG</span>
            <span class="detail-value">{{ activeShelfGame(shelfName).bgg ?? '—' }}</span>
          </div>

          <div class="detail-divider"></div>

          <p
            v-if="activeShelfGame(shelfName).notes"
            class="detail-notes"
          >
            {{ activeShelfGame(shelfName).notes }}
          </p>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const games = [
  {
    title: 'Arboretum',
    shelf: 'Shelf One',
    order: 1,
    width: 1.5,
    height: 6.25,
    accentColor: 'rgba(163, 190, 140, 0.18)',
    stats: {
      players: '2–4',
      playtime: '25–40 min'
    },
    bgg: 7.4,
    notes: 'Sharp, clever, and just mean enough to be memorable.',
    favorite: true
  },
  {
    title: 'Birdie',
    shelf: 'Shelf One',
    order: 2,
    width: 8.2,
    height: 10.5,
    accentColor: 'rgba(137, 180, 250, 0.16)',
    stats: {
      players: '1–4',
      playtime: '30–45 min'
    },
    bgg: 6.4,
    notes: 'Quiet in the best way. Easy to table, easy to love.',
    favorite: true
  },
  {
    title: 'Bossa',
    shelf: 'Shelf One',
    order: 3,
    width: 1.1,
    height: 3.4,
    accentColor: 'rgba(203, 166, 247, 0.14)',
    stats: {
      players: '1–5',
      playtime: '40–70 min'
    },
    bgg: 6.9,
    notes: 'The obvious bird game, yes, but still gorgeous.',
    favorite: false
  },
  {
    title: 'Cartographers',
    shelf: 'Shelf One',
    order: 4,
    width: 1.5,
    height: 8,
    stats: {
      players: '2–4',
      playtime: '30–45 min'
    },
    bgg: 7.6,
    notes: 'Draw the most proficient maps to earn favor.',
    favorite: false
  },
  {
    title: 'Cartographers Heroes',
    shelf: 'Shelf One',
    order: 4,
    width: 1.5,
    height: 8,
    accentColor: 'rgba(243, 139, 168, 0.14)',
    stats: {
      players: '2–4',
      playtime: '30–45 min'
    },
    bgg: 7.7,
    notes: 'Draw the most proficient maps to earn favor.',
    favorite: false
  },

  {
    title: 'Spirit Island',
    shelf: 'Shelf Two',
    order: 1,
    width: 3.4,
    height: 11.5,
    accentColor: 'rgba(250, 179, 135, 0.16)',
    stats: {
      players: '1–4',
      playtime: '90–120 min'
    },
    bgg: 8.3,
    notes: 'Dense, brilliant, and worth the effort.',
    favorite: true
  },
  {
    title: 'Parks',
    shelf: 'Shelf Two',
    order: 2,
    width: 2.5,
    height: 10.6,
    accentColor: 'rgba(166, 227, 161, 0.16)',
    stats: {
      players: '1–5',
      playtime: '30–60 min'
    },
    bgg: 7.8,
    notes: 'One of those games that earns its place visually and mechanically.',
    favorite: false
  },
  {
    title: 'Carcassonne',
    shelf: 'Shelf Two',
    order: 3,
    width: 2.3,
    height: 10.1,
    stats: {
      players: '2–5',
      playtime: '35–45 min'
    },
    bgg: 7.4,
    notes: 'Classic for a reason.',
    favorite: false
  },
  {
    title: 'Ark Nova',
    shelf: 'Shelf Two',
    order: 4,
    width: 3.7,
    height: 11.8,
    accentColor: 'rgba(243, 139, 168, 0.14)',
    stats: {
      players: '1–4',
      playtime: '90–150 min'
    },
    bgg: 8.5,
    notes: 'Big, sprawling, and the kind of box that wants attention.',
    favorite: true
  }
]

const activeGame = ref(null)
const isTouchMode = ref(false)
const isMobile = ref(false)

const groupedShelves = computed(() => {
  const grouped = {}

  for (const game of games) {
    if (!grouped[game.shelf]) grouped[game.shelf] = []
    grouped[game.shelf].push(game)
  }

  for (const shelf in grouped) {
    grouped[shelf].sort((a, b) => a.order - b.order)
  }

  return grouped
})

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

function spineStyle(game) {
  const visualWidth = clamp(game.width * 20, 42, 98)
  const visualHeight = clamp(game.height * 24, 180, 320)

  return {
    width: `${visualWidth}px`,
    height: `${visualHeight}px`
  }
}

function setActive(game) {
  activeGame.value = game
}

function clearActive() {
  if (!isTouchMode.value && !isMobile.value) {
    activeGame.value = null
  }
}

function handleHover(game) {
  if (!isTouchMode.value && !isMobile.value) {
    activeGame.value = game
  }
}

function handleLeave() {
  if (!isTouchMode.value && !isMobile.value) {
    activeGame.value = null
  }
}

function toggleActive(game) {
  if (isMobile.value) {
    activeGame.value = activeGame.value?.title === game.title ? null : game
    return
  }

  isTouchMode.value = true
  activeGame.value = activeGame.value?.title === game.title ? null : game
}

function activeShelfGame(shelfName) {
  if (!activeGame.value) return null
  return activeGame.value.shelf === shelfName ? activeGame.value : null
}

function handleDocumentClick(event) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  if (!target.closest('.game-wrapper') && !target.closest('.mobile-inline-card')) {
    activeGame.value = null
  }
}

function updateViewportMode() {
  isMobile.value = window.innerWidth <= 900
  if (!isMobile.value) {
    isTouchMode.value = false
  }
}

onMounted(() => {
  updateViewportMode()
  window.addEventListener('resize', updateViewportMode)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode)
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.board-game-shelf-page {
  margin: 2rem 0 3rem;
}

.shelf-block {
  margin: 0 0 3rem;
}

.shelf-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.shelf-header h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.shelf-decoration {
  position: relative;
  width: 48px;
  height: 50px;
}

.plant-stem {
  position: absolute;
  bottom: 10px;
  left: 22px;
  width: 3px;
  height: 20px;
  background: var(--vp-c-text-1);
}

.plant-leaf {
  position: absolute;
  width: 14px;
  height: 10px;
  border: 2px solid var(--vp-c-text-1);
  background: color-mix(in oklab, var(--vp-c-bg) 85%, white 15%);
}

.leaf-1 {
  bottom: 22px;
  left: 6px;
  transform: rotate(-30deg);
}

.leaf-2 {
  bottom: 28px;
  right: 6px;
  transform: rotate(30deg);
}

.shelf-decoration::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 14px;
  width: 20px;
  height: 10px;
  border: 3px solid var(--vp-c-text-1);
  background: color-mix(in oklab, var(--vp-c-bg) 95%, white 5%);
}

.shelf-scroll {
  overflow-x: auto;
  padding-bottom: 1rem;
}

.shelf-row {
  position: relative;
  display: flex;
  align-items: end;
  gap: 0.7rem;
  min-width: max-content;
  padding: 1rem 0 0.4rem;
  overflow: visible;
}

.game-wrapper {
  position: relative;
  display: flex;
  align-items: end;
  overflow: visible;
}

.game-spine {
  position: relative;
  display: block;
  border: 5px solid var(--vp-c-text-1);
  background: color-mix(in oklab, var(--vp-c-bg) 97%, white 3%);
  padding: 0;
  cursor: pointer;
  transition: transform 0.18s ease;
  overflow: visible;
  box-shadow: 8px 8px 0 var(--vp-c-text-1);
}

.game-spine:hover,
.game-spine:focus-visible,
.game-spine.is-active {
  transform: translate(-2px, -2px);
}

.spine-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0.45rem 0.2rem;
}

.spine-title {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-orientation: mixed;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1;
  color: var(--vp-c-text-1);
}

.watercolor-accent {
  position: absolute;
  inset: auto auto 10px -8px;
  width: calc(100% + 16px);
  height: calc(100% - 18px);
  border-radius: 42% 58% 47% 53% / 52% 38% 62% 48%;
  filter: blur(1px);
  transform: rotate(-3deg);
  z-index: 1;
}

.game-detail-card {
  border: 4px solid var(--vp-c-text-1);
  background: color-mix(in oklab, var(--vp-c-bg) 98%, white 2%);
  box-shadow: 8px 8px 0 var(--vp-c-text-1);
  padding: 0.85rem 0.95rem;
}

.desktop-card {
  position: absolute;
  left: calc(100% + 12px);
  top: 0;
  z-index: 20;
  width: 260px;
}

.mobile-inline-card {
  display: none;
}

.detail-title {
  margin-bottom: 0.7rem;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
}

.detail-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.35rem;
}

.detail-label {
  font-weight: 700;
}

.detail-value {
  text-align: right;
}

.detail-divider {
  border-top: 2px dotted color-mix(in oklab, var(--vp-c-text-1) 100%, transparent);
  margin: 0.75rem 0 0.75rem;
}

.detail-notes {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.45;
}

.shelf-line {
  height: 8px;
  background: var(--vp-c-text-1);
  width: 100%;
  min-width: max-content;
}

.shelf-endcap {
  width: 24px;
  height: 180px;
  border-left: 5px solid var(--vp-c-text-1);
  margin-left: 0.25rem;
}

.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 900px) {
  .desktop-card {
    display: none;
  }

  .mobile-inline-card {
    display: block;
    margin-top: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .shelf-block {
    margin-bottom: 2.25rem;
  }
}

@media (max-width: 640px) {
  .shelf-header {
    align-items: center;
  }

  .shelf-header h2 {
    font-size: 1rem;
  }

  .game-spine {
    box-shadow: 6px 6px 0 var(--vp-c-text-1);
  }

  .game-detail-card {
    box-shadow: 6px 6px 0 var(--vp-c-text-1);
  }

  .spine-title {
    font-size: 0.85rem;
  }

  .detail-meta-row {
    font-size: 0.88rem;
  }
}
</style>
