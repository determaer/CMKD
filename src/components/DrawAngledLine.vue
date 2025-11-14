<script setup lang="ts">
import { controlPoint } from "../helpers/controlPoint";
import { useParamStore } from "../store/paramStore";

const { reloadCount } = useParamStore();

const props = defineProps<{
  startRadius: number;
  endRadius: number;
  angle: number;
  color: string;
  width: number;
}>();

const [startX, startY] = controlPoint(props.startRadius, props.angle);
const [endX, endY] = controlPoint(props.endRadius, props.angle);
</script>

<template>
  <v-line
    :key="`${reloadCount}-angled-line`"
    :points="[startX, startY, endX, endY]"
    :stroke="color"
    :strokeWidth="width"
  />
</template>

<style scoped></style>
