<script setup lang="ts">
import { computed } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import { calcControlPoint } from "../helpers/calcControlPoint";
import DrawSupportLabel from "./DrawSupportLabel.vue";
import type { Label } from "../types";
import DrawRect from "./DrawRect.vue";

const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  objLabel: Label;
  selected?: boolean;
}>();

const lAngle = computed(
  () =>
    store.angles.value.find(
      (lAngle) => lAngle.labelId === props.objLabel.id,
    ) ?? {
      labelAngle: 0,
      labelId: 0,
      inAngle: 0,
      outAngle: 0,
      arrowAngle: 0,
    },
);

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

const handleClick = () => {
  clickedStore.setClickedLabel(props.objLabel);
};

const drawSupportLabel = computed(() => {
  if (
    store.showSupportRect.value &&
    (props.objLabel.num > 1 ||
      (!props.objLabel.isBase && !store.showAdditionalInCircle.value))
  )
    return true;
  return false;
});

const drawLabel = computed(() => {
  if (store.showAdditionalInCircle.value || props.objLabel.isBase) return true;
  else return false;
});

const drawRectCount = computed(() => {
  const noConstraints = !store.showSupportRect.value && !store.showScore.value;
  return noConstraints ? props.objLabel.num : 1;
});
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
    :key="`${store.reloadCount.value}-${objLabel.id}-support-label-wrapper`"
    :angle="lAngle.labelAngle"
    :objLabel="objLabel"
    :labelXY="labelXY"
  />
  <DrawRect
    v-if="drawLabel"
    :key="`${store.reloadCount.value}-${objLabel.id}-label-wrapper`"
    :objLabel="objLabel"
    :selected="selected"
    :radius="store.radiuses.value.labelRadius"
    :angle="lAngle.labelAngle"
    :rectCount="drawRectCount"
    :showScore="store.showScore.value"
    @clicked="handleClick"
  />
</template>
