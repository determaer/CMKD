<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import type { Label } from "../types";
import { calcLine } from "../helpers/calcLine";
const store = useParamStore();
const clickedStore = useClickedStore();

const props = defineProps<{
  objLabelOut: Label;
  objLabelIn: Label;
}>();

const scale = ref(1);

const points = ref<number[]>();

const dash = computed(() => {
  if (
    (props.objLabelIn.prop !== 0 || props.objLabelOut.prop !== 0) &&
    !store.oneLevel.value
  )
    return [5, 2];
  return null;
});

const stroke = computed(() => {
  if (store.showImportant.value) {
    if (
      props.objLabelOut.score < 0 ||
      (props.objLabelIn.score < 0 && props.objLabelOut.isBase)
    ) {
      return "red";
    }
  }
  return "black";
});

const draw = computed(() => {
  if (store.position.value && props.objLabelIn.index > store.position.value)
    return false;
  return true;
});

onMounted(() => {
  points.value = calcLine(props.objLabelIn, props.objLabelOut);
});

const handleClick = () => {
  scale.value = 1;
  clickedStore.resetClicked();
  nextTick(() => {
    clickedStore.isClickedLine.value = true;
    clickedStore.clickedLine.value = {
      objLabelIn: props.objLabelIn,
      objLabelOut: props.objLabelOut,
    };
    clickedStore.clickedInfo.value = {
      type: "line",
      object: {
        objLabelIn: props.objLabelIn,
        objLabelOut: props.objLabelOut,
      },
    };
  });
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

<style scoped></style>
