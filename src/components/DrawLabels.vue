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

const label = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.labelRadius,
    lAngle.value.labelAngle,
  ),
);
const inInner = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.innerRadius,
    lAngle.value.inAngle,
  ),
);
const outInner = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.innerRadius,
    lAngle.value.outAngle,
  ),
);
const outMerging = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.mergingPortsRadius,
    lAngle.value.outAngle,
  ),
);
const inMerging = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.mergingPortsRadius,
    lAngle.value.inAngle,
  ),
);
const arrow = computed(() =>
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
      inInner.x,
      inInner.y,
      inMerging.x,
      inMerging.y,
      label.x,
      label.y,
      outMerging.x,
      outMerging.y,
      outInner.x,
      outInner.y,
    ]"
    stroke="black"
    :strokeWidth="2 * store.scaleMultiplier.value"
    lineJoin="round"
  />
  <v-arrow
    :key="`${store.reloadCount.value}-${objLabel.id}-arrow-label`"
    :points="[arrow.x, arrow.y, inInner.x, inInner.y]"
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
    :labelCP="label"
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
