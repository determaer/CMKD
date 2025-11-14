<script setup lang="ts">
import { computed, ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import { controlPoint } from "../helpers/controlPoint";
import type { Sector } from "../types/sector";

const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  sector: Sector;
  bgColor: string;
  shadowed?: boolean;
  opacity?: number;
}>();

const fill = ref(props.bgColor);

const handleClick = () => {
  clickedStore.clickedInfo.value = {
    type: "sector",
    object: props.sector,
  };
  clickedStore.isClickedSector.value = true;
  clickedStore.clickedSector.value = props.sector;
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
  return controlPoint(
    store.radiuses.value.labelRadius +
      50 * props.sector.sLevel * store.scaleMultiplier.value,
    90 + targetAngle.value,
  );
});

const nameXY = computed<[number, number]>(() => {
  return controlPoint(
    store.radiuses.value.sectorNameRadius,
    90 + targetAngle.value,
  );
});

const labelFillColor = computed(() => {
  if (props.sector.object.score > 0) {
    return "green";
  }
  if (props.sector.object.score < 0) {
    return "red";
  }
  return "white";
});

const labelWithLabel = computed(() => {
  if (props.sector.object && props.sector.object.isLabel) return true;
  else return false;
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
</script>

<template>
  <v-arc
    :x="store.x.value"
    :y="store.y.value"
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
    v-if="store.showSectorName.value"
    :x="nameXY[0]"
    :y="nameXY[1]"
    :text="sector.shortname"
    :offset="{
      x: 20 * coeff,
      y: 10 * coeff,
    }"
    fontFamily="Times New Roman"
    :fontSize="22 * coeff"
    :rotation="nameRotation"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="labelWithLabel && sector.object.level != 0"
    :x="labelXY[0]"
    :y="labelXY[1]"
    :width="36 * coeff"
    :height="36 * coeff"
    fill="white"
    stroke="black"
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-(sector.sEnd - arcLength / 2)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="labelWithLabel && store.showScore.value && sector.object.level != 0"
    :x="labelXY[0]"
    :y="labelXY[1]"
    :width="36 * coeff"
    :height="36 * coeff"
    :opacity="Math.abs(sector.object.score)"
    :fill="shadowed ? 'white' : labelFillColor"
    :stroke="shadowed ? labelFillColor : 'black'"
    :strokeWidth="1 * store.scaleMultiplier.value"
    :offset="{
      x: 18 * coeff,
      y: 18 * coeff,
    }"
    :rotation="-(sector.sEnd - arcLength / 2)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="labelWithLabel && sector.object.level != 0"
    :x="labelXY[0]"
    :y="labelXY[1]"
    :text="sector.object.typeText"
    :offset="{
      x: 13 * coeff,
      y: 10 * coeff,
    }"
    fontFamily="Times New Roman"
    :fontSize="22 * coeff"
    :fontStyle="sector.object.fontStyle"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="labelWithLabel && sector.object.level != 0"
    :x="labelXY[0]"
    :y="labelXY[1]"
    :text="sector.object.numText"
    :offset="{
      x: 1 * coeff,
      y: 2 * coeff,
    }"
    fontFamily="Times New Roman"
    :fontSize="16 * coeff"
    :fontStyle="sector.object.fontStyle"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="!labelWithLabel && sector.object.level != 0"
    :x="labelXY[0]"
    :y="labelXY[1]"
    :text="sector.object.typeText + sector.object.numText"
    :offset="{
      x: 20 * coeff,
      y: 10 * coeff,
    }"
    fontFamily="Times New Roman"
    :fontSize="22 * coeff"
    :rotation="nameRotation"
    :fontStyle="sector.object.fontStyle"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
</template>
