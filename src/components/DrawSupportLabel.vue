<script setup lang="ts">
import { computed, ref } from "vue";
import { calcControlPoint } from "../helpers/calcControlPoint";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import type { Label } from "../types";
import type { Angle } from "../types/angle";
import {
  calcTextFontSize,
  calcLeftShiftOffset,
  calcRightShiftOffset,
} from "../helpers/calcTextAdjustments";

const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  angles: Angle;
  objLabel: Label;
  labelXY: [number, number];
}>();
const supLabelXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.additionalLabelRadius,
    props.angles.labelAngle,
  ),
);
const supLabelXY2 = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.additionalLabelRadius + 2.5,
    props.angles.labelAngle + 0.6,
  ),
);
const supLabelXY3 = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.additionalLabelRadius + 5,
    props.angles.labelAngle + 1.2,
  ),
);

const scale = ref(1);

const handleClick = () => {
  scale.value = 1;
  clickedStore.clickedInfo.value = {
    type: "supportLabel",
    object: props.objLabel,
  };
};

const handleMouseOver = () => {
  scale.value = 1.5;
};

const handleMouseOut = () => {
  scale.value = 1;
};

const drawDoubleLabel = computed(() => {
  if (
    props.objLabel.num > 2 ||
    (props.objLabel.num > 1 &&
      !props.objLabel.isBase &&
      !store.showAdditionalInCircle.value)
  )
    return true;
  else return false;
});

const drawTripleLabel = computed(() => {
  if (
    props.objLabel.num > 3 ||
    (props.objLabel.num > 2 &&
      !props.objLabel.isBase &&
      !store.showAdditionalInCircle.value)
  )
    return true;
  return false;
});

const coeff = computed(() => {
  return store.sizeMultiplier.value * scale.value * store.scaleMultiplier.value;
});

const labelConfig = computed(() => ({
  width: 36 * coeff.value,
  height: 36 * coeff.value,
  strokeWidth: 1 * store.scaleMultiplier.value,
  offsetX: 18 * coeff.value,
  offsetY: 18 * coeff.value,
  rotation: -props.angles.labelAngle,
}));

const textConfig = computed(() => ({
  x: supLabelXY.value[0],
  y: supLabelXY.value[1],
  fontFamily: "Times New Roman",
  fontStyle: props.objLabel.fontStyle,
}));
</script>

<template>
  <v-line
    :points="[labelXY[0], labelXY[1], supLabelXY[0], supLabelXY[1]]"
    :strokeWidth="2 * store.scaleMultiplier.value"
    stroke="black"
  />
  <v-rect
    v-if="drawTripleLabel"
    :config="labelConfig"
    :x="supLabelXY3[0]"
    :y="supLabelXY3[1]"
    fill="white"
    stroke="black"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="drawDoubleLabel"
    :config="labelConfig"
    :x="supLabelXY2[0]"
    :y="supLabelXY2[1]"
    fill="white"
    stroke="black"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    :config="labelConfig"
    :x="supLabelXY[0]"
    :y="supLabelXY[1]"
    fill="white"
    stroke="black"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    :config="textConfig"
    :text="objLabel.typeText"
    :offset="calcLeftShiftOffset(objLabel.typeText, 22 * coeff, coeff)"
    :fontSize="calcTextFontSize(22 * coeff, objLabel.typeText)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    :config="textConfig"
    :text="objLabel.numText"
    :offset="calcRightShiftOffset(objLabel.typeText, 16 * coeff, coeff)"
    :fontSize="calcTextFontSize(16 * coeff, objLabel.numText)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
</template>
