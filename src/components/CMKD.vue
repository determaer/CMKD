<script setup lang="ts">
import { ref, watch, unref, watchEffect } from "vue";
import { useParamStore } from "../store/paramStore";
import { useClickedStore } from "../store/clickedStore";
import DrawLabels from "./DrawLabels.vue";
import DrawLineBtwElements from "./DrawLineBtwElements.vue";
import DrawBase from "./DrawBase.vue";
import DrawClickedElement from "./DrawClickedElement.vue";
import DrawClickedLine from "./DrawClickedLine.vue";
import DrawClickedSector from "./DrawClickedSector.vue";
import DrawArrows from "./DrawArrows.vue";
import type { Label } from "../types/label";

const store = useParamStore();
const {
  isClickedElement,
  isClickedLine,
  isClickedSector,
  clickedInfo,
  clickLayerX,
  clickLayerY,
  resetClicked,
} = useClickedStore();

const {
  width = 800,
  drawingMode = "default",
  position = 9999,
  showSupportRect = false,
  showImportant = false,
  showDefaultRect = false,
  labels,
} = defineProps<{
  width?: number;
  drawingMode?: "default" | "score" | "light";
  position?: number;
  showSupportRect?: boolean;
  showImportant?: boolean;
  showDefaultRect?: boolean;
  labels: Label[];
}>();

defineExpose({
  downloadURI,
  resetClicked,
});

const emit = defineEmits<{
  clicked: [typeof clickedInfo.value];
  unclicked: [];
}>();

const stageRef = ref();

watch(
  () => labels,
  () => {
    store.labels.value = labels;
    store.updateCMKD();
  },
  { immediate: true, deep: true },
);

watchEffect(() => {
  store.width.value = width;
  store.position.value = position;
  store.showImportant.value = showImportant;
  store.showSupportRect.value = showSupportRect;
  store.showDefaultRect.value = showDefaultRect;
  store.updateCMKD();
});

watch(
  () => drawingMode,
  () => {
    const map = {
      default: [true, false, false],
      score: [false, true, false],
      light: [false, true, true],
    } as const;
    [
      store.showAdditionalInCircle.value,
      store.showScore.value,
      store.showLight.value,
    ] = map[drawingMode];
    store.updateCMKD();
  },
  { immediate: true },
);

watch(
  () => [store.scaleMultiplier, store.sizeMultiplier],
  () => {
    store.updateCMKD();
  },
  { immediate: true },
);

watch(
  () => clickedInfo.value,
  () => {
    emit("clicked", clickedInfo.value);
  },
);

function downloadURI() {
  var link = document.createElement("a");
  link.download = "stage.png";
  link.href = unref(stageRef).getStage().toDataURL({ pixelRatio: 10 });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <v-stage
    v-if="store.angles.value.length > 0"
    ref="stageRef"
    :width="store.width.value"
    :height="store.width.value"
  >
    <v-layer>
      <v-rect
        fill="white"
        :x="store.centerPoint.value - store.width.value"
        :y="store.centerPoint.value - store.width.value"
        :width="store.width.value * store.scaleMultiplier.value * 3"
        :height="store.width.value * store.scaleMultiplier.value * 3"
      />
      <DrawBase bgColor="#dad0f1" bgColor2="#e8e8e8" />
      <DrawLineBtwElements
        v-for="line of store.lines.value"
        :key="String(line.objLabelIn.id) + line.objLabelOut.id"
        :objLabelOut="line.objLabelOut"
        :objLabelIn="line.objLabelIn"
      />
      <DrawArrows />
      <DrawLabels
        v-for="label of store.labelsZero.value"
        :key="label.id"
        :objLabel="label"
      />
    </v-layer>
    <v-layer v-if="isClickedElement || isClickedLine || isClickedSector">
      <v-rect
        fill="white"
        :x="clickLayerX"
        :y="clickLayerY"
        :width="store.width.value * store.scaleMultiplier.value * 3"
        :height="store.width.value * store.scaleMultiplier.value * 3"
        :opacity="0.6"
        @click="
          () => {
            resetClicked();
            emit('unclicked');
          }
        "
      />
      <DrawClickedElement v-if="isClickedElement" />
      <DrawClickedLine v-if="isClickedLine" />
      <DrawClickedSector v-if="isClickedSector" bgColor="gray" />
    </v-layer>
  </v-stage>
</template>

<style scoped></style>
