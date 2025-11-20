<script setup lang="ts">
import { computed, ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import { calcControlPoint } from "../helpers/calcControlPoint";
import type { Sector } from "../types/sector";
import { calcCenteredOffset } from "../helpers/calcTextAdjustments";
import { isSectorObjectValidForUpperLevelsCMKD } from "../types/sector";
import DrawRect from "./DrawRect.vue";

const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  sector: Sector;
  bgColor: string;
  opacity?: number;
}>();

const validObject = computed(() => {
  if (isSectorObjectValidForUpperLevelsCMKD(props.sector.object))
    return props.sector.object;
  return false;
});

const fill = ref(props.bgColor);

const handleClick = () => {
  clickedStore.setClickedSector(props.sector);
};

const handleMouseOver = () => {
  fill.value = "gray";
};

const handleMouseOut = () => {
  fill.value = props.bgColor;
};

const targetAngle = computed(
  () =>
    90 + (props.sector.sEnd - (props.sector.sEnd - props.sector.sStart) / 2),
);

const arcLength = computed(() => props.sector.sEnd - props.sector.sStart);

const targetLabelRadius = computed(
  () =>
    store.radiuses.value.labelRadius +
    50 * props.sector.sLevel * store.scaleMultiplier.value,
);

const labelXY = computed<[number, number]>(() => {
  return calcControlPoint(
    store.centerPoint.value,
    targetLabelRadius.value,
    targetAngle.value,
  );
});

const nameXY = computed<[number, number]>(() => {
  return calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.sectorNameRadius,
    targetAngle.value,
  );
});

const sectorWithLabel = computed(() => {
  if (!validObject.value) return false;
  if (validObject.value.isLabel && props.sector.sLevel > 0) return true;
});

const coeff = computed(() => {
  return store.sizeMultiplier.value * store.scaleMultiplier.value;
});

const nameRotation = computed(() => {
  const angleCorrection =
    targetAngle.value > 180 && targetAngle.value < 360 ? 1 : 0;

  return -(props.sector.sEnd - arcLength.value / 2) - 180 * angleCorrection;
});

const outerRadius = computed(
  () =>
    store.radiuses.value.outerRadius +
    50 * props.sector.sLevel * store.scaleMultiplier.value,
);

const innerRadius = computed(
  () =>
    store.radiuses.value.innerRadius +
    50 * props.sector.sLevel * store.scaleMultiplier.value,
);

const textConfig = computed(() => ({
  x: labelXY.value[0],
  y: labelXY.value[1],
  fontFamily: "Times New Roman",
}));
</script>

<template>
  <v-arc
    :x="store.centerPoint.value"
    :y="store.centerPoint.value"
    :angle="360 - arcLength"
    :rotation="-90 - sector.sStart"
    :outerRadius="outerRadius"
    :innerRadius="innerRadius"
    :fill="fill"
    stroke="black"
    :opacity="opacity"
    :clockwise="true"
    :strokeWidth="2 * store.scaleMultiplier.value"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="store.showSectorName.value && sector.shortname"
    :config="{
      ...textConfig,
      x: nameXY[0],
      y: nameXY[1],
      fontStyle: 'normal',
    }"
    :text="sector.shortname"
    :offset="calcCenteredOffset(sector.shortname, 22 * coeff)"
    :fontSize="22 * coeff"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <DrawRect
    v-if="validObject && validObject.isLabel"
    :objLabel="validObject"
    :selected="false"
    :radius="targetLabelRadius"
    :angle="targetAngle"
    :rectCount="1"
    :showScore="store.showScore.value"
    @clicked="handleClick"
    @mouseovered="handleMouseOver"
    @mouseouted="handleMouseOut"
  />
  <v-text
    v-if="!sectorWithLabel && sector.shortname && sector.sLevel > 0"
    :key="`${store.reloadCount.value}-${sector.object.id}-sector-text`"
    :config="textConfig"
    :fontSize="22 * coeff"
    :text="sector.shortname"
    :offset="calcCenteredOffset(sector.shortname, 22 * coeff)"
    :rotation="nameRotation"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
</template>
