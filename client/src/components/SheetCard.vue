<template>
  <div class="sheet-card" :style="{ backgroundColor: image?.commonColor }">
    <img :src="image?.url" />
    <h1 :class="{ 'extra-long': sheet.name.length > 20 }">
      {{ props.sheet.name }}
    </h1>
    <div class="sheet-card__content">
      <p>{{ getSubtitle() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import sheetImages from '@/assets/data/sheet-images.json';
import { Character } from '@/game-data/sheets/character-sheet';
import { Crew } from '@/game-data/sheets/crew-sheet';
import { PropType, computed } from 'vue';
const props = defineProps({
  sheet: {
    type: Object as PropType<Crew | Character>,
    required: true
  }
});

const image = computed(() =>
  sheetImages.find((sheetImage) => sheetImage.id === props.sheet.image)
);

function getSubtitle() {
  if (props.sheet.sheetType === 'crew') {
    const crewSheet = props.sheet as Crew;
    return `Tier ${crewSheet.tier} ❖ ${crewSheet.crewType}`;
  } else {
    const characterSheet = props.sheet as Character;
    return `${characterSheet.characterType}`;
  }
}
</script>

<style lang="scss" scoped>
.sheet-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  height: 16rem;
  overflow: hidden;
  box-shadow: var(--shadow);
  animation: fade 0.5s ease-in-out;

  > img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }

  > h1 {
    display: inline-flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex: 1;
    width: 100%;
    color: var(--light);
    font-size: 2.8rem;
    font-weight: bold;
    text-shadow: 2px 2px 2px var(--dark);
    line-height: 1;
    z-index: 1;
    padding: 0.4rem;

    &.extra-long {
      font-size: 2rem;
    }
  }

  > .sheet-card__content {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    z-index: 1;
    margin-top: auto;
    width: 100%;
    background-color: var(--translucent-heavy);
    padding: 1rem;
    color: var(--light);

    > p {
      text-align: center;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-size: 0.8rem;
      opacity: 0.8;
    }
  }
}
</style>
