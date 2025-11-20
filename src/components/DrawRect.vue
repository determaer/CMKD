<script setup lang="ts">
import { computed, ref } from "vue";
import { useParamStore } from "../store/paramStore";
import { calcControlPoint } from "../helpers/calcControlPoint";
import { type Label, instanceOfLabel } from "../types";
import {
  calcLeftShiftOffset,
  calcTextFontSize,
  calcRightShiftOffset,
} from "../helpers/calcTextAdjustments";
import type { SObjectLabel } from "../types/sector";
const store = useParamStore();

const { objLabel, selected, radius, angle, rectCount, showScore } =
  defineProps<{
    objLabel: Label | SObjectLabel;
    selected?: boolean;
    radius: number;
    angle: number;
    rectCount: number;
    showScore: boolean;
  }>();

const emit = defineEmits<{
  clicked: [];
  mouseouted: [];
  mouseovered: [];
}>();

const objLabelIndex = computed(() =>
  store.labelsZero.value.findIndex((label) => label.id == objLabel.id),
);

const scale = ref(1);

const labelXY = computed(() =>
  calcControlPoint(store.centerPoint.value, radius, angle),
);
const labelXY2 = computed(() =>
  calcControlPoint(store.centerPoint.value, radius + 2.5, angle + 0.6),
);
const labelXY3 = computed(() =>
  calcControlPoint(store.centerPoint.value, radius + 5, angle + 1.2),
);

const labelControlPoints = computed(() => {
  const result: { label: [number, number]; scored: boolean }[] = [];

  if (rectCount > 2) result.push({ label: labelXY3.value, scored: false });
  if (rectCount > 1) result.push({ label: labelXY2.value, scored: false });
  if (rectCount > 0) result.push({ label: labelXY.value, scored: false });
  if (showScore) result.push({ label: labelXY.value, scored: true });

  return result;
});

const handleClick = () => {
  scale.value = 1;
  emit("clicked");
};

const handleMouseOver = () => {
  scale.value = 1.5;
  emit("mouseovered");
};

const handleMouseOut = () => {
  scale.value = 1;
  emit("mouseouted");
};

const fillColor = computed(() => {
  if (objLabelIndex.value > store.position.value) return "yellow";
  if (instanceOfLabel(objLabel) && objLabel.grey) {
    return "lightgrey";
  } else {
    if (objLabel.score > 0) {
      return "green";
    } else if (objLabel.score < 0) {
      return "red";
    }
  }
  return "white";
});

const cornerRadius = computed(() => {
  const r = {
    rect: 0,
    roundrect: 7 * scale.value,
    circle: 18 * scale.value,
  };
  if (instanceOfLabel(objLabel) && !store.showDefaultRect.value)
    return r[objLabel.type];
  return r["rect"];
});

const coeff = computed(() => {
  return store.sizeMultiplier.value * scale.value * store.scaleMultiplier.value;
});

const scoredLabelOpacity = computed(() =>
  fillColor.value === "lightgrey" || selected || fillColor.value == "yellow"
    ? 1
    : Math.abs(objLabel.score),
);

const labelConfig = computed(() => ({
  width: 36 * coeff.value,
  height: 36 * coeff.value,
  strokeWidth: 1 * store.scaleMultiplier.value,
  offsetX: 18 * coeff.value,
  offsetY: 18 * coeff.value,
  rotation: -angle,
  cornerRadius: cornerRadius.value,
}));

const textConfig = computed(() => ({
  x: labelXY.value[0],
  y: labelXY.value[1],
  fontFamily: "Times New Roman",
  fontStyle: objLabel.fontStyle,
}));
</script>

<template>
  <v-rect
    v-for="(labelCP, index) of labelControlPoints"
    :key="`${store.reloadCount.value}-${objLabel.id}-${index}-label`"
    :config="labelConfig"
    :x="labelCP.label[0]"
    :y="labelCP.label[1]"
    :opacity="labelCP.scored ? scoredLabelOpacity : 1"
    :fill="selected || !labelCP.scored ? 'white' : fillColor"
    :stroke="selected && labelCP.scored ? fillColor : 'black'"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
  <v-text
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
