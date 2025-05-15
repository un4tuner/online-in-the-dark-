<template>
  <div class="row">
    <div class="pie-chart" @click="incrementClock">
      <div class="slice" v-for="i in segments" :key="i">
        <svg viewBox="-50 -50 100 100">
          <path
            :d="drawSlice(i, segments.length)"
            :style="{
              fill: props.clock.value > i ? 'var(--primary)' : 'var(--dark)',
              stroke: 'var(--dark-2)'
            }"
          ></path>
        </svg>
      </div>
    </div>
    <h2>{{ props.clock.name }}</h2>
    <p v-html="text(props.clock.description)"></p>
  </div>
</template>

<script lang="ts" setup>
import { Clock } from '@/game-data/game-data-types';
import { text } from '@/util/string';
import { computed } from 'vue';
const props = defineProps<{
  clock: Clock;
  change: (index: number) => void;
}>();

const segments = computed(() => {
  return Array.from({ length: props.clock.segments }, (_, i) => i);
});

function drawSlice(index: number, segmentsCount: number) {
  const radius = 50;
  // -90 degrees to start at the top
  const startAngle = (index / segmentsCount) * Math.PI * 2 - Math.PI / 2;
  const endAngle = ((index + 1) / segmentsCount) * Math.PI * 2 - Math.PI / 2;
  const x1 = Math.cos(startAngle) * radius;
  const y1 = Math.sin(startAngle) * radius;
  const x2 = Math.cos(endAngle) * radius;
  const y2 = Math.sin(endAngle) * radius;
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
  return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

function incrementClock() {
  const newValue = props.clock.value + 1;
  props.change(newValue > props.clock.segments ? 0 : newValue);
}
</script>

<style scoped lang="scss">
.pie-chart {
  position: relative;
  height: 8rem;
  min-width: 8rem;

  > .slice {
    position: absolute;
    height: 8rem;
    width: 8rem;
    cursor: pointer;
  }
}

h2 {
  margin-bottom: 0.2rem;
}

p {
  color: #888;
  font-size: 0.95em;
  margin-top: 0.2rem;
}
</style>
