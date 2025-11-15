<script setup lang="ts">
import { computed, ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import { calcControlPoint } from "../helpers/calcControlPoint";
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
    store.radiuses.value.labelRadius +
      50 * props.sector.sLevel * store.scaleMultiplier.value,
    90 + targetAngle.value,
  );
});

const nameXY = computed<[number, number]>(() => {
  return calcControlPoint(
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

const sectorWithLabel = computed(() => {
  if (props.sector.object.isLabel && props.sector.object.level > 0) return true;
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
  fontStyle: props.sector.object.fontStyle,
  fontSize: 22 * coeff.value,
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
    v-if="store.showSectorName.value"
    :config="{
      ...textConfig,
      x: nameXY[0],
      y: nameXY[1],
    }"
    :text="sector.shortname"
    :offsetX="10 * coeff"
    :offsetY="10 * coeff"
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
    v-if="sectorWithLabel && store.showScore.value"
    :config="labelConfig"
    :opacity="Math.abs(sector.object.score)"
    :fill="shadowed ? 'white' : labelFillColor"
    :stroke="shadowed ? labelFillColor : 'black'"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="sectorWithLabel"
    :key="`${store.reloadCount.value}-${sector.object.id}-sectorlabel-type-text`"
    :config="textConfig"
    :text="sector.object.typeText"
    :offsetX="13 * coeff"
    :offsetY="10 * coeff"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="sectorWithLabel"
    :key="`${store.reloadCount.value}-${sector.object.id}-sectorlabel-num-text`"
    :config="{
      ...textConfig,
      fontSize: 16 * coeff,
    }"
    :text="sector.object.numText"
    :offsetX="1 * coeff"
    :offsetY="2 * coeff"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="!sectorWithLabel && sector.object.level != 0"
    :key="`${store.reloadCount.value}-${sector.object.id}-sector-text`"
    :config="textConfig"
    :text="sector.object.typeText + sector.object.numText"
    :offsetX="10 * coeff"
    :offsetY="20 * coeff"
    :rotation="nameRotation"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
</template>
