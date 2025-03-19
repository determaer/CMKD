<script setup lang="ts">
import { ref, onMounted, watch, unref } from 'vue'
import { useParamStore } from '../store/paramStore'
import { useClickedStore } from '../store/clickedStore'
import DrawLabels from './DrawLabels.vue'
import DrawLineBtwElements from './DrawLineBtwElements.vue'
import DrawBase from './DrawBase.vue'
import DrawClickedElement from './DrawClickedElement.vue'
import DrawClickedLine from './DrawClickedLine.vue'
import DrawClickedSector from './DrawClickedSector.vue'
import DrawArrows from './DrawArrows.vue'
import { Label } from '../types/label'
import { calcParams } from '../helpers/calcParams'
import { calcLabels } from '../helpers/calcLabels'

const store = useParamStore()
const clickedStore = useClickedStore()

const props = defineProps({
  width: {
    type: Number,
    default: 800,
  },
  drawingMode: {
    type: String,
    default: 'default',
  }, 
  labels: {
    type: Array<Label>,
    required: true,
  },
  position: {
    type: Number,
    default: 9999,
  },
  showSupportRect: {
    type: Boolean,
    default: false,
  }, 
  showImportant: {
    type: Boolean,
    default: false,
  },
})

defineExpose({
  downloadURI
})

const emit = defineEmits(['clicked'])

const stageRef = ref()

watch(
  () => props.width,
  () => {
    store.width = props.width
    store.scaleMultiplier = store.width / 800
    store.x = props.width / 2
    store.y = props.width / 2
  },
  {immediate: true}
)

watch(
  () => props,
  () => {
    store.position = props.position
    store.showImportant = props.showImportant
    store.showSupportRect = props.showSupportRect
    store.labels = props.labels
  },
  {immediate: true, deep: true}
)

watch(
  () => {props.drawingMode},
  () => {
    if (props.drawingMode == 'default') {
      store.showAdditionalInCircle = true
      store.showScore = false
      store.defaultRect = false
      store.showLight = false
    }
    if (props.drawingMode == 'score') {
      store.showAdditionalInCircle = false
      store.showScore = true
      store.defaultRect = false
      store.showLight = false
      }
    if (props.drawingMode == 'light') {
      store.showAdditionalInCircle = false
      store.showScore = true
      store.defaultRect = false
      store.showLight = true
    }
  },
  {immediate: true}
)

watch(
  () => {store.scaleMultiplier, store.sizeMultiplier},
  () => {
    calcParams(store)
  },
  {immediate: true}
)

watch(
  () => clickedStore.clickedInfo,
  () => {
    emit('clicked', clickedStore.clickedInfo)
  }
)

onMounted(() => {
  calcLabels(store)
  calcParams(store)
})

function downloadURI() {
  var link = document.createElement('a')
  link.download = 'stage.png'
  link.href = unref(stageRef).getStage().toDataURL({pixelRatio: 10})
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>

<template>
  <v-stage
    v-if="store.params.angles.length > 0"
    :width="store.width"
    :height="store.width"
    ref='stageRef'
  >
    <v-layer>
      <v-rect
        fill='white'
        :x="store.x - store.width"
        :y="store.y - store.width"
        :width="store.width * store.scaleMultiplier * 3"
        :height="store.width * store.scaleMultiplier * 3"
      />
      <DrawBase
        bgColor='#dad0f1'
        bgColor2='#e8e8e8'
      />
      <DrawLineBtwElements
        v-for="line of store.lines"
        :objLabelOut="line.objLabelOut"
        :objLabelIn="line.objLabelIn"
      />
      <DrawArrows />
      <DrawLabels
        v-for="label of store.labelsZero"
        :objLabel="label"
      />
    </v-layer>
    <v-layer
      v-if="clickedStore.clickedElement.isClicked || clickedStore.clickedLine.isClicked || clickedStore.clickedSector.isClicked"
    >
      <v-rect
        fill='white'
        :x="clickedStore.clickLayerX"
        :y="clickedStore.clickLayerY"
        :width="store.width * store.scaleMultiplier * 3"
        :height="store.width * store.scaleMultiplier * 3"
        @click="() => {clickedStore.resetClicked()}"
        :opacity="0.6"
      />
      <DrawClickedElement
        v-if="clickedStore.clickedElement.isClicked"
      />
      <DrawClickedLine
        v-if="clickedStore.clickedLine.isClicked"
      />
      <DrawClickedSector
        v-if="clickedStore.clickedSector.isClicked"
        bgColor='gray'
      />
    </v-layer>
  </v-stage>
</template>

<style scoped>

</style>
