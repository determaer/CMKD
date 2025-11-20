<script setup lang="ts">
import { computed } from "vue";
import { calcControlPoint } from "../helpers/calcControlPoint";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import type { Label } from "../types";
import DrawRect from "./DrawRect.vue";
import type { ControlPoint } from "../types/control";

const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  angle: number;
  objLabel: Label;
  labelCP: ControlPoint;
}>();

const supLabel = computed(() =>
  calcControlPoint(
    store.centerPoint.value,
    store.radiuses.value.additionalLabelRadius,
    props.angle,
  ),
);

const handleClick = () => {
  clickedStore.clickedInfo.value = {
    type: "supportLabel",
    object: props.objLabel,
  };
};

const drawRectCount = computed(() => {
  const noConstraints =
    !props.objLabel.isBase && !store.showAdditionalInCircle.value;
  return noConstraints ? props.objLabel.num : props.objLabel.num - 1;
});
</script>

<template>
  <v-line
    :points="[labelCP.x, labelCP.y, supLabel.x, supLabel.y]"
    :strokeWidth="2 * store.scaleMultiplier.value"
    stroke="black"
  />
  <DrawRect
    :key="`${store.reloadCount.value}-${objLabel.id}-supportlabel-wrapper`"
    :objLabel="objLabel"
    :selected="false"
    :radius="store.radiuses.value.additionalLabelRadius"
    :angle="angle"
    :rectCount="drawRectCount"
    :showScore="false"
    @clicked="handleClick"
  />
</template>
