<template>
  <div class="sheet-card" :style="{ backgroundColor: cardData.color }">
    <img :src="cardData.image" />
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
import scoreImages from '@/assets/data/score-images.json';
import resolveImageUrl from '@/util/resolveImageUrl';
import { Character } from '@/game-data/sheets/character-sheet';
import { Crew } from '@/game-data/sheets/crew-sheet';
import { Score } from '@/game-data/sheets/score-sheet'; 
import { World } from '@/game-data/sheets/world-sheet';
import { PropType, computed } from 'vue';
const props = defineProps({
  sheet: {
    type: Object as PropType<Crew | Character | Score | World>,
    required: true
  }
});

const defaultCard = {
  image: '/images/cover-images/default-score-image.png',
  color: '#222',
};

function getCardData(sheet: Crew | Character | Score | World) {
  if ((sheet as any).sheetType === 'score') {
    const scoreType = (sheet as any).scoreType;
    if (scoreType) {
      const entry = scoreImages.find(img => img.type.toLowerCase() === scoreType.toLowerCase());
      if (entry) return { image: entry.image, color: entry.color || defaultCard.color };
    }
    return defaultCard;
  } else if ((sheet as any).sheetType === 'world') {
    const worldSheet = sheet as World;
    if (worldSheet.worldType === 'illustration' && worldSheet.illustrations && worldSheet.illustrations.length) {
      return { image: resolveImageUrl(`/images/${worldSheet.illustrations[0].filename}`), color: '#2e5c7a' };
    } else if (worldSheet.worldType === 'illustration') {
      return { image: '/images/parchment-default.jpg', color: '#2e5c7a' };
    } else if (worldSheet.worldType === 'book') {
      return { image: '/images/book-default.jpg', color: '#7a5c2e' };
    }
    return defaultCard;
  } else {
    // For crew and character, match by image or name
    const entry = sheetImages.find(img => img.id === (sheet as any).image || img.name?.toLowerCase() === (sheet as any).name?.toLowerCase());
    if (entry) return { image: entry.url, color: entry.commonColor || defaultCard.color };
    return defaultCard;
  }
}

const cardData = computed(() => getCardData(props.sheet));

function getSubtitle() {
  if ((props.sheet as any).sheetType === 'crew') {
    const crewSheet = props.sheet as Crew;
    return `Tier ${crewSheet.tier} ❖ ${crewSheet.crewType}`;
  } else if ((props.sheet as any).sheetType === 'character') {
    const characterSheet = props.sheet as Character;
    return `${characterSheet.characterType}`;
  } else if ((props.sheet as any).sheetType === 'score') {
    const scoreSheet = props.sheet as Score;
    return `${scoreSheet.scoreType} ❖ Tier ${scoreSheet.tierLevel}`;
  } else if ((props.sheet as any).sheetType === 'world') {
    const worldSheet = props.sheet as World;
    return worldSheet.worldType === 'book' ? 'Book' : 'Image';
  }
  return '';
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
