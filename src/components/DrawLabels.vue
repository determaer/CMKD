<script setup lang="ts">
import { computed, ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import { calcControlPoint } from "../helpers/calcControlPoint";
import DrawSupportLabel from "./DrawSupportLabel.vue";
import type { Label } from "../types";
import {
  calcLeftShiftOffset,
  calcTextFontSize,
  calcRightShiftOffset,
} from "../helpers/calcTextAdjustments";
const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  objLabel: Label;
  selected?: boolean;
}>();

const objLabelIndex = computed(() =>
  store.labelsZero.value.findIndex((label) => label.id == props.objLabel.id),
);

const lAngle = computed(
  () =>
    store.angles.value.find(
      (lAngle) => lAngle.labelId === objLabelIndex.value,
    ) ?? {
      labelAngle: 0,
      labelId: 0,
      inAngle: 0,
      outAngle: 0,
      arrowAngle: 0,
    },
);

const scale = ref(1);

const labelXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.labelRadius,
    lAngle.value.labelAngle,
  ),
);
const inInnerXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.innerRadius,
    lAngle.value.inAngle,
  ),
);
const outInnerXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.innerRadius,
    lAngle.value.outAngle,
  ),
);
const outMergingXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.mergingPortsRadius,
    lAngle.value.outAngle,
  ),
);
const inMergingXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.mergingPortsRadius,
    lAngle.value.inAngle,
  ),
);
const arrowXY = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.innerRadius - 1,
    lAngle.value.inAngle,
  ),
);
const labelXY2 = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.labelRadius + 2.5,
    lAngle.value.labelAngle + 0.6,
  ),
);
const labelXY3 = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.labelRadius + 5,
    lAngle.value.labelAngle + 1.2,
  ),
);

const handleClick = () => {
  scale.value = 1;
  clickedStore.setClickedLabel(props.objLabel);
};

const handleMouseOver = () => {
  scale.value = 1.5;
};

const handleMouseOut = () => {
  scale.value = 1;
};

const fillColor = computed(() => {
  if (store.showScore.value) {
    if (objLabelIndex.value > store.position.value) return "yellow";
    if (props.objLabel.grey) {
      return "lightgrey";
    } else {
      if (props.objLabel.score > 0) {
        return "green";
      } else if (props.objLabel.score < 0) {
        return "red";
      }
    }
  }
  return "white";
});

const drawSupportLabel = computed(() => {
  if (
    store.showSupportRect.value &&
    (props.objLabel.num > 1 ||
      (!props.objLabel.isBase && !store.showAdditionalInCircle.value))
  )
    return true;
  return false;
});

const cornerRadius = computed(() => {
  const r = {
    rect: 0,
    roundrect: 7 * scale.value,
    circle: 18 * scale.value,
  };
  if (!store.showDefaultRect.value) return r[props.objLabel.type];
  return r["rect"];
});

const coeff = computed(() => {
  return store.sizeMultiplier.value * scale.value * store.scaleMultiplier.value;
});

const drawRectLabel = computed(() => {
  if (store.showAdditionalInCircle.value || props.objLabel.isBase) return true;
  else return false;
});

const drawDoubleLabel = computed(() => {
  if (
    props.objLabel.num > 1 &&
    !store.showSupportRect.value &&
    !store.showScore.value
  )
    return true;
  else return false;
});

const drawTripleLabel = computed(() => {
  if (
    props.objLabel.num > 2 &&
    !store.showSupportRect.value &&
    !store.showScore.value
  )
    return true;
  else return false;
});

const drawTextLabel = computed(() => {
  if (store.showAdditionalInCircle.value || props.objLabel.isBase) return true;
  else return false;
});

const scoredLabelOpacity = computed(() =>
  fillColor.value === "lightgrey" ||
  props.selected ||
  fillColor.value == "yellow"
    ? 1
    : Math.abs(props.objLabel.score),
);

const labelConfig = computed(() => ({
  width: 36 * coeff.value,
  height: 36 * coeff.value,
  strokeWidth: 1 * store.scaleMultiplier.value,
  offsetX: 18 * coeff.value,
  offsetY: 18 * coeff.value,
  rotation: -lAngle.value.labelAngle,
  cornerRadius: cornerRadius.value,
}));

const textConfig = computed(() => ({
  x: labelXY.value[0],
  y: labelXY.value[1],
  fontFamily: "Times New Roman",
  fontStyle: props.objLabel.fontStyle,
}));
</script>

<template>
  <v-line
    :key="`${store.reloadCount.value}-${objLabel.id}-lines-label`"
    :points="[
      inInnerXY[0],
      inInnerXY[1],
      inMergingXY[0],
      inMergingXY[1],
      labelXY[0],
      labelXY[1],
      outMergingXY[0],
      outMergingXY[1],
      outInnerXY[0],
      outInnerXY[1],
    ]"
    stroke="black"
    :strokeWidth="2 * store.scaleMultiplier.value"
    lineJoin="round"
  />
  <v-arrow
    :key="`${store.reloadCount.value}-${objLabel.id}-arrow-label`"
    :points="[arrowXY[0], arrowXY[1], inInnerXY[0], inInnerXY[1]]"
    stroke="black"
    fill="black"
    :pointerWidth="
      10 * store.sizeMultiplier.value * store.scaleMultiplier.value
    "
    :pointerLength="10 * store.scaleMultiplier.value"
  />
  <DrawSupportLabel
    v-if="drawSupportLabel"
    :angles="lAngle"
    :objLabel="objLabel"
    :labelXY="labelXY"
  />
  <!-- Label -->
  <v-rect
    v-if="drawTripleLabel && drawRectLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-3-label`"
    :config="labelConfig"
    :x="labelXY3[0]"
    :y="labelXY3[1]"
    fill="white"
    stroke="black"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="drawDoubleLabel && drawRectLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-2-label`"
    :config="labelConfig"
    :x="labelXY2[0]"
    :y="labelXY2[1]"
    fill="white"
    stroke="black"
    @сlick="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="drawRectLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-1-label`"
    :config="labelConfig"
    :x="labelXY[0]"
    :y="labelXY[1]"
    fill="white"
    stroke="black"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-rect
    v-if="store.showScore.value && drawRectLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-scored-label`"
    :config="labelConfig"
    :x="labelXY[0]"
    :y="labelXY[1]"
    :opacity="scoredLabelOpacity"
    :fill="selected ? 'white' : fillColor"
    :stroke="selected ? fillColor : 'black'"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <!-- Text in label -->
  <v-text
    v-if="drawTextLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-type-text`"
    :config="textConfig"
    :text="objLabel.typeText"
    :offset="calcLeftShiftOffset(objLabel.typeText, 22 * coeff, coeff)"
    :fontSize="calcTextFontSize(22 * coeff, objLabel.typeText)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
    v-if="drawTextLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-num-text`"
    :config="textConfig"
    :text="objLabel.numText"
    :offset="calcRightShiftOffset(objLabel.typeText, 16 * coeff, coeff)"
    :fontSize="calcTextFontSize(16 * coeff, objLabel.numText)"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
</template>
