<script setup lang="ts">
import { ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { calcArrows, type Arrow, type Arc } from "../helpers/calcArrows";

const store = useParamStore();

const arrowsInLabels = ref<Arrow[]>([]);
const arcBtwLabels = ref<Arc[]>([]);

calcArrows(arrowsInLabels.value, arcBtwLabels.value);
</script>

<template v-if="arcBtwLabels.length > 0">
  <v-arrow
    v-for="a of arrowsInLabels"
    :key="`${store.reloadCount.value}-${a.startX}-arrow-base-trajectory`"
    :points="[a.startX, a.startY, a.endX, a.endY]"
    stroke="black"
    fill="black"
    :pointerWidth="7 * store.sizeMultiplier.value * store.scaleMultiplier.value"
    :pointerLength="7 * store.scaleMultiplier.value"
  />
  <v-arc
    v-for="a of arcBtwLabels"
    :key="`${store.reloadCount.value}-${a.angle}-arc-base-trajectory`"
    :x="store.x.value"
    :y="store.y.value"
    stroke="black"
    :angle="a.angle"
    :innerRadius="store.radiuses.value.labelRadius"
    :outerRadius="store.radiuses.value.labelRadius"
    :clockwise="true"
    :rotation="a.rotation"
    :strokeWidth="2 * store.scaleMultiplier.value"
  />
</template>

<style scoped></style>
