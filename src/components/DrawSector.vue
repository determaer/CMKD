<script setup lang="ts">
import { computed, ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import { calcControlPoint } from "../helpers/calcControlPoint";
import type { Sector } from "../types/sector";
import {
  calcTextFontSize,
  calcCenteredOffset,
  calcLeftShiftOffset,
  calcRightShiftOffset,
} from "../helpers/calcTextAdjustments";
import { isSectorObjectValidForUpperLevelsCMKD } from "../types/sector";

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
  () => props.sector.sEnd - (props.sector.sEnd - props.sector.sStart) / 2,
);

const arcLength = computed(() => props.sector.sEnd - props.sector.sStart);

const labelXY = computed<[number, number]>(() => {
  return calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.labelRadius +
      50 * props.sector.sLevel * store.scaleMultiplier.value,
    90 + targetAngle.value,
  );
});

const nameXY = computed<[number, number]>(() => {
  return calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.sectorNameRadius,
    90 + targetAngle.value,
  );
});

const labelFillColor = computed(() => {
  if (!validObject.value) return "white";
  if (validObject.value.score > 0) {
    return "green";
  }
  if (validObject.value.score < 0) {
    return "red";
  }
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
    targetAngle.value > 90 && targetAngle.value < 270 ? 1 : 0;

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

const labelConfig = computed(() => ({
  x: labelXY.value[0],
  y: labelXY.value[1],
  width: 36 * coeff.value,
  height: 36 * coeff.value,
  strokeWidth: 1 * store.scaleMultiplier.value,
  offsetX: 18 * coeff.value,
  offsetY: 18 * coeff.value,
  rotation: -(props.sector.sEnd - arcLength.value / 2),
}));

const textConfig = computed(() => ({
  x: labelXY.value[0],
  y: labelXY.value[1],
  fontFamily: "Times New Roman",
  fontStyle: validObject.value && validObject.value.fontStyle,
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
  <v-rect
    v-if="sectorWithLabel"
    :config="labelConfig"
    fill="white"
    stroke="black"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="sectorWithLabel && store.showScore.value && validObject"
    :config="labelConfig"
    :opacity="Math.abs(validObject.score)"
    :fill="labelFillColor"
    :stroke="'black'"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="sectorWithLabel && validObject"
    :key="`${store.reloadCount.value}-${sector.object.id}-sectorlabel-type-text`"
    :config="textConfig"
    :fontSize="calcTextFontSize(22 * coeff, validObject.typeText)"
    :text="validObject.typeText"
    :offset="calcLeftShiftOffset(validObject.typeText, 22 * coeff, coeff)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="sectorWithLabel && validObject"
    :key="`${store.reloadCount.value}-${sector.object.id}-sectorlabel-num-text`"
    :config="textConfig"
    :fontSize="calcTextFontSize(16 * coeff, validObject.numText)"
    :text="validObject.numText"
    :offset="calcRightShiftOffset(validObject.numText, 16 * coeff, coeff)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
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
