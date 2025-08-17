<script setup lang="ts">
import { ref, onBeforeMount, watch, unref } from 'vue'
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
const {clickedElement, clickedInfo, clickedLine, clickedSector, clickLayerX, clickLayerY, resetClicked} = useClickedStore()



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
  forceResetClicked: {
    type: Boolean,
    default: false,
  }
})

defineExpose({
  downloadURI
})

const emit = defineEmits(['clicked', 'unclicked'])

const stageRef = ref()

watch(
  () => props.forceResetClicked,
  () => {
    if (props.forceResetClicked) resetClicked()
  }
)

watch(
  () => props.labels,
  () => {
    store.resetParams()
    store.labels.value = props.labels
    calcLabels()
    calcParams()
  },
  {immediate: true, deep: true}
)

watch(
  () => props.width,
  () => {
    store.width.value = props.width
    store.scaleMultiplier.value = store.width.value / 800
    store.x.value = props.width / 2
    store.y.value = props.width / 2
  },
  {immediate: true}
)

watch(
  () => props,
  () => {
    store.position.value = props.position
    store.showImportant.value = props.showImportant
    store.showSupportRect.value = props.showSupportRect
  },
  {immediate: true, deep: true}
)

watch(
  () => {props.drawingMode},
  () => {
    if (props.drawingMode == 'default') {
      store.showAdditionalInCircle.value = true
      store.showScore.value = false
      store.defaultRect.value = false
      store.showLight.value = false
    }
    if (props.drawingMode == 'score') {
      store.showAdditionalInCircle.value = false
      store.showScore.value = true
      store.defaultRect.value = false
      store.showLight.value = false
      }
    if (props.drawingMode == 'light') {
      store.showAdditionalInCircle.value = false
      store.showScore.value = true
      store.defaultRect.value = false
      store.showLight.value = true
    }
  },
  {immediate: true}
)

watch(
  () => {store.scaleMultiplier, store.sizeMultiplier},
  () => {
    calcParams()
  },
  {immediate: true}
)

watch(
  () => clickedInfo.value,
  () => {
    emit('clicked', clickedInfo.value)
  }
)

onBeforeMount(() => {
  calcLabels()
  calcParams()
  console.log(store)
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
    v-if="store.params.value.angles.length > 0"
    :width="store.width.value"
    :height="store.width.value"
    ref='stageRef'
  >
    <v-layer>
      <v-rect
        fill='white'
        :x="store.x.value - store.width.value"
        :y="store.y.value - store.width.value"
        :width="store.width.value * store.scaleMultiplier.value * 3"
        :height="store.width.value * store.scaleMultiplier.value * 3"
      />
      <DrawBase
        bgColor='#dad0f1'
        bgColor2='#e8e8e8'
      />
      <DrawLineBtwElements
        v-for="line of store.lines.value"
        :objLabelOut="line.objLabelOut"
        :objLabelIn="line.objLabelIn"
      />
      <DrawArrows />
      <DrawLabels
        v-for="label of store.labelsZero.value"
        :objLabel="label"
      />
    </v-layer>
    <v-layer
      v-if="clickedElement.isClicked || clickedLine.isClicked || clickedSector.isClicked"
    >
      <v-rect
        fill='white'
        :x="clickLayerX"
        :y="clickLayerY"
        :width="store.width.value * store.scaleMultiplier.value * 3"
        :height="store.width.value * store.scaleMultiplier.value * 3"
        @click="() => {
          resetClicked()
          emit('unclicked')
        }"
        :opacity="0.6"
      />
      <DrawClickedElement
        v-if="clickedElement.isClicked"
      />
      <DrawClickedLine
        v-if="clickedLine.isClicked"
      />
      <DrawClickedSector
        v-if="clickedSector.isClicked"
        bgColor='gray'
      />
    </v-layer>
  </v-stage>
</template>

<style scoped>

</style>
