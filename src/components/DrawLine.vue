<script setup lang="ts">
import { ref, computed } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import type { Label } from "../types";
import { calcLinePoint } from "../helpers/calcLinePoints";
const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  objLabelOut: Label;
  objLabelIn: Label;
}>();

const scale = ref(1);

const points = computed(() =>
  calcLinePoint(
    props.objLabelIn,
    props.objLabelOut,
    store.angles.value,
    store.discNum.value,
    store.scaleMultiplier.value,
    store.radiuses.value.innerRadius,
    store.radiuses.value.lineStartRadius,
    store.centerPoint.value,
  ),
);

const dash = computed(() => {
  if (
    (props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) &&
    !store.oneLevel.value
  )
    return [5, 2];
  return null;
});

const stroke = computed(() => {
  if (
    store.showImportant.value &&
    props.objLabelOut.isBase &&
    props.objLabelIn.isBase &&
    (props.objLabelOut.score < 0 || props.objLabelIn.score < 0)
  ) {
    return "red";
  }
  return "black";
});

const draw = computed(() => {
  if (store.showUnreached.value && props.objLabelIn.yellow) return false;
  return true;
});

const handleClick = () => {
  scale.value = 1;
  clickedStore.setClickedLine(props.objLabelIn, props.objLabelOut);
};

const handleMouseOver = () => {
  scale.value = 3;
};

const handleMouseOut = () => {
  scale.value = 1;
};
</script>

<template>
  <v-line
    v-if="draw"
    :key="`${store.reloadCount.value}-${objLabelIn.id}-${objLabelOut.id}-line`"
    :bezier="true"
    :points="points"
    :stroke="stroke"
    :strokeWidth="2.2 * scale * store.scaleMultiplier.value"
    :dash="dash"
    @click="handleClick"
    @mouse-over="handleMouseOver"
    @mouse-out="handleMouseOut"
  />
</template>
