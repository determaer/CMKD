<script setup>
import DrawLabels from './DrawLabels.vue'
import DrawLineBtwElements from './DrawLineBtwElements.vue'
import DrawBase from './DrawBase.vue'
import DrawClickedElement from './DrawClickedElement.vue'
import DrawClickedLine from './DrawClickedLine.vue'
import DrawClickedSector from './DrawClickedSector.vue'
import DrawArrows from './DrawArrows.vue'
//import { labels } from '../data/labels'

import { ref, provide, onMounted, computed, watch } from 'vue'

const props = defineProps({
  scaleMultiplier: Number,
  drawingMode: String,
  labels: Array,
  download: Boolean,
  redFlags: Array,
  oneLevel: Boolean,
  dialogSized: Boolean,
  position: Number,
  extShowSupportRect: Boolean,
  showImportant: Boolean,
})

const emit = defineEmits(['setActionItem','setClickedInfo'])

const width = ref(800)
const height = ref(800)
const clickLayerX = ref(-1000)
const clickLayerY = ref(-1000)
const discNum = ref(0)
const circleNum = ref(0)
const labelsZero = ref([])
const circleDivider = 5

const sectors = ref([])
const lines = ref([])

const showSupportRect = ref(props.extShowSupportRect)
const showAdditionalInCircle = ref(true)
const defaultRect = ref(true)
const showScore = ref(false)
const showLight = ref(false)
const showSectorName = ref(false)

const clickedLine = ref({
  isClicked: false,
  objLabelIn: null,
  objLabelOut: null,
})

const clickedElement = ref({
  isClicked: false,
  objLabel: null, //содержит внутри объекта id элементов далее
  prevLabels: null, //стрелка к ним
  nextLabels: null, //стрелка от них
})
const clickedSector= ref({
  isClicked: false,
  sector: null,
})

const params = ref({
  outerRadius: 0, //внешний радиус окружности диаграммы
  innerRadius: 0, //внутренний радиус окружности диаграммы
  labelRadius: 0, //радиус расположения элементов
  additionalLabelRadius: 0, //радиус расположения дополнительных элементов
  linesBtwElementsRadius: 0, //радиус конечных точек для линий-соединителей
  mergingPortsRadius: 0, //радиус на котором начинается слияние портов элемента
  angles: [],
  dividerAngles: [],
})

const pointNum = computed(() => {return discNum.value * circleDivider})

const xCenter = computed(() => {
  if (props.dialogSized) return width.value / 4.4
  return width.value / 2
})

const yCenter = computed(() => {
  if (props.dialogSized) return height.value / 4.4
  return height.value / 2
})

const sizeMultiplier = computed(() => {
  if (discNum.value <= 10) return 1
  if (discNum.value > 10 && discNum.value < 20) return 0.9
  if (discNum.value >= 20 && discNum.value < 30) return 0.8
  if (discNum.value >= 30 && discNum.value < 40) return 0.75
  if (discNum.value >= 40 && discNum.value < 50) return 0.7
  if (discNum.value >= 50) return 0.65
  else return 1
})

/*React.useEffect(() => {
  if (dialogSized) {
    setWidth(width / 2.2)
    setHeight(height / 2.2)
    setClickLayerX(0)
    setClickLayerY(0)
  }
}, [dialogSized])*/

watch(
  () => {props.drawingMode, props.extShowSupportRect},
  () => {
    if (drawingMode == 'default') {
      showSupportRect.value = false
      showAdditionalInCircle.value = true
      showScore.value = false
      defaultRect.value = false
      showLight.value = false
      if (oneLevel)
        showSectorName.value = true
    }
    if (drawingMode == 'default+') {
      showSupportRect.value = true
      showAdditionalInCircle.value = false
      showScore.value = false
      defaultRect.value = false
      showLight.value = false
      if (oneLevel) showSectorName.value = true
    }
    if (drawingMode == 'score') {
      showSupportRect.value = props.extShowSupportRect
      showAdditionalInCircle.value = false
      showScore.value = true
      defaultRect.value = false
      showLight.value = false
      if (oneLevel) showSectorName.value = true
      }
    if (drawingMode == 'light') {
      showSupportRect.value = props.extShowSupportRect
      showAdditionalInCircle.value = false
      showScore.value = true
      defaultRect.value = false
      showLight.value = true
      if (oneLevel) showSectorName.value = true
    }
  }
)



const calcParams = () => {
  let arrLabelAngles = [],
  arrInAngles = [],
  arrOutAngles = [],
  arrArrowsAngles = [],
  arrDividerAngles = []
  for (let i = 1; i <= discNum.value * 2; i = i + 2) {
    let t = i * (360 / (discNum.value * 2)) + 90
    arrLabelAngles.push(t)
  }
  console.log(pointNum.value, discNum.value)
  for (let i = 1; i < pointNum.value; i = i + circleDivider) {
    let tIn = (i + 1) * (360 / pointNum.value) + 90 //+ (4 - 4 ** sizeMultiplier)
    let tOut = (i + 2) * (360 / pointNum.value) + 90 //- (4 - 4 ** sizeMultiplier)
    let tArrow = tIn - 2 * sizeMultiplier.value
    arrArrowsAngles.push(tArrow)
    arrInAngles.push(tOut)
    arrOutAngles.push(tIn)
  }
  let arrAngles = []
  console.log(labelsZero.value)
  for (let i = 0; i < discNum.value; i = i + 1) {
    arrAngles.push({
      labelId: labelsZero.value[i].index,
      inAngle: arrInAngles[i],
      outAngle: arrOutAngles[i],
      labelAngle: arrLabelAngles[i],
      arrowAngle: arrArrowsAngles[i],
    })
  }
  arrDividerAngles.push(90)
  for (let i = 0; i < discNum.value - 1; i = i + 1) {
    if (labelsZero.value[i].prop !== labelsZero.value[i + 1].prop) {
      arrDividerAngles.push(
        arrLabelAngles[i] + (arrLabelAngles[i + 1] - arrLabelAngles[i]) / 2
      )
    }
  }
  const add = discNum.value < 50 ? 0 : 50
  params.value = ({
    outerRadius: (250 + add) * props.scaleMultiplier,
    innerRadius: (200 + add) * props.scaleMultiplier,
    labelRadius: (225 + add) * props.scaleMultiplier,
    additionalLabelRadius: (285 + add) * props.scaleMultiplier,
    linesBtwElementsRadius: (190 + add) * props.scaleMultiplier,
    mergingPortsRadius: (212 + add) * props.scaleMultiplier,
    sectorNameRadius: (265 + add) * props.scaleMultiplier,
    dividerAngles: arrDividerAngles,
    angles: arrAngles,
  })
}
    
const calcAngles = () => {
  for (let i = circleNum.value; i >= 0; i = i - 1) {
    console.log(params)
    let sectorsAngles = []
    let sectorsLabels = []
    let currentAngle = 0
    sectorsAngles.push(0)

    if (params.value.angles.length > 0) {
      if (i == 0) {
        let sectorsAngles = []
        let sectorsLabels = []
        let start, end1, upperID, shortname
        sectorsAngles.push(0)
        if (params.value.angles.length > 0) {
          labelsZero.value.map((label) => {
            if (label.secStart) {
              start = label.index
              upperID = label.object.parent_id
              shortname = label.sectorName
            }
            if (label.secEnd) {
              end1 = label.index
                sectorsLabels.push({
                  sStartLID: start,
                  sEndLID: end1,
                  upperID: upperID,
                  sLevel: 0,
                  shortname: shortname,
                })
              start = null
              end1 = null
              let end = label.index
              if (end != props.labels.length - 1) {
                // console.log(end)
                let angle1 = params.value.angles.find(
                  (lAngle) => lAngle.labelId === end + 1
                ).labelAngle
                let angle2 = params.value.angles.find(
                  (lAngle) => lAngle.labelId === end
                ).labelAngle
                let angle = angle2 + (angle1 - angle2) / 2
                sectorsAngles.push(angle - 90)
              }
            }
          })
        }
        sectorsAngles.push(360)
        if (sectorsLabels.length > 0){
          for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
            sectors.value.push({
              sStart: sectorsAngles[i],
              sEnd: sectorsAngles[i + 1],
              sStartLID: sectorsLabels[i].sStartLID,
              sEndLID: sectorsLabels[i].sEndLID,
              sLevel: sectorsLabels[i].sLevel,
              upperID: sectorsLabels[i].upperID,
              shortname: sectorsLabels[i].shortname,
            })
          }
        }
      } 
      else {
        props.labels.map((label) => {
          if (label.level == i) {
            sectorsAngles.push(
              currentAngle + 360 * (label.secLength / discNum.value)
            )
            currentAngle = currentAngle + 360 * (label.secLength / discNum.value)
            sectorsLabels.push({
              sStartLID: label.index,
              sEndLID: label.index,
              sLevel: i,
              objLabel: label,
              upperID: label.object.parent_id,
            })
          }
        })
      }
      console.log(sectorsLabels)
      if (sectorsLabels.length > 0){
        for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
          sectors.value.push({
            sStart: sectorsAngles[i],
            sEnd: sectorsAngles[i + 1],
            sStartLID: sectorsLabels[i].sStartLID,
            sEndLID: sectorsLabels[i].sEndLID,
            sLevel: sectorsLabels[i].sLevel,
            objLabel: sectorsLabels[i].objLabel,
            upperID: sectorsLabels[i].upperID,
          })
        }
      }
    }
    
  }
}

watch(
  () => {props.scaleMultiplier, sizeMultiplier.value},
  () => {
    calcParams()
  },
  {immediate: true}
)

const setClickedInfo = () => {}

const setClickedSector = () => {}

const setActionItem = () => {}

const setClickedElement = () => {}

const setClickedLine = () => {}




onMounted(() => {
  let t = 0
  let tLevel = 0
  let labelsZeroLevel = []
  for (let i = 0; i < props.labels.length; i = i + 1) {
    if (props.labels[i].level > tLevel) 
      tLevel = props.labels[i].level
    if (props.labels[i].level == 0) {
       t = t + 1
       labelsZeroLevel.push(props.labels[i])
    }
  }
  circleNum.value = tLevel
  discNum.value = t
  console.log(labelsZeroLevel)
  labelsZero.value = labelsZeroLevel

  labelsZero.value.map((label, from) => {
    if (label.connections.length !== 0) {
      label.connections.map((to) => {
        if (props.labels.some((elem) => elem.id == to)){
          if ((showLight.value && (props.redFlags.some((elem_id) => elem_id == to) ||
            (label.score < 0 && label.isBase == true))) || !showLight.value ||
            (props.oneLevel && label.drawAnyCase)){
              lines.value.push({
                objLabelOut: labelsZero.value[from],
                objLabelIn: labelsZero.value.find((x) => x.id === to),
              })
          }
        }
      })
    }
  })
  calcParams()
  calcAngles()
  
  setTimeout(() => {
    console.log(params.value)
  }, 2000)
})

function downloadURI(uri, name) {
  var link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>

<template>
  <v-stage
    v-if="params.angles.length > 0"
    :scale="scaleMultiplier"
    :width="width"
    :height="height"
    ref='stageRef'
    @click="() => {
      console.log('www')
    }"
  >
    <v-layer>
      <v-rect
        fill='white'
        :x="xCenter - width"
        :y="yCenter - height"
        :width="width * scaleMultiplier * 3"
        :height="height * scaleMultiplier * 3"
      />
      <DrawBase
        :x="xCenter"
        :y="yCenter"
        :params="params"
        :scaleMultiplier="scaleMultiplier"
        :sizeMultiplier="sizeMultiplier"
        :sectors="sectors"
        bgColor='#dad0f1'
        bgColor2='#e8e8e8'
        :circleNum="circleNum"
        :flags="{
          showScore: showScore,
          showSectorName: showSectorName,
          oneLevel: oneLevel,
          showSupportRect: showSupportRect,
        }"
        
      />
<!--@setClickedInfo="setClickedInfo"
        @setClickedSector="setClickedSector"-->
      <DrawLineBtwElements
        v-for="line of lines"
        :x="xCenter"
        :y="yCenter"
        :params="params"
        :objLabelOut="line.objLabelOut"
        :objLabelIn="line.objLabelIn"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        :scaleMultiplier="scaleMultiplier"
        :flags="{
          showScore: showScore,
          showLight: showLight,
          oneLevel: oneLevel,
          showImportant: showImportant,
        }"
        @setActionItem="setActionItem"
        @setClickedInfo="setClickedInfo"
        :discNum="discNum"
        :position="position"
      />
      <DrawArrows
        :params="params"
        :labels="labelsZero"
        :flags="{
          showSupportRect: showSupportRect,
          showAdditionalInCircle: showAdditionalInCircle,
        }"
        :x="xCenter"
        :y="yCenter"
        :sizeMultiplier="sizeMultiplier"
        :scaleMultiplier="scaleMultiplier"
      />

      <DrawLabels
        v-for="label of labelsZero"
        :x="xCenter"
        :y="yCenter"
        :params="params"
        :objLabel="label"
        :flags="{
          showSupportRect: showSupportRect,
          showAdditionalInCircle:showAdditionalInCircle,
          defaultRect: defaultRect,
          showScore: showScore,
          showLight: showLight,
        }"
        :sizeMultiplier="sizeMultiplier"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        :labels="labelsZero"
        :scaleMultiplier="scaleMultiplier"
        @setActionItem=setActionItem
        @setClickedInfo="setClickedInfo"
        :position="position"
      />
    </v-layer>
    <!--v-layer
      v-if="clickedElement.isClicked || clickedLine.isClicked || clickedSector.isClicked"
    >
      <v-rect
        fill='white'
        :x="clickLayerX"
        :y="clickLayerY"
        :width="width * props.scaleMultiplier * 3"
        :height="height * props.scaleMultiplier * 3"
        @click="() => {
          setClickedElement({isClicked: false})
          setClickedLine({isClicked: false})
          setClickedInfo(null)
          setClickedSector({isClicked: false})
        }"
        :opacity="0.6"
      />
      <DrawClickedElement
        v-if="clickedElement.isClicked"
        :clickedElement="clickedElement"
        :params="params"
        :x="xCenter"
        :y="yCenter"
        :flags="{
          showSupportRect: showSupportRect,
          showAdditionalInCircle:showAdditionalInCircle,
          defaultRect: defaultRect,
          showScore: showScore,
          showLight: showLight,
          oneLevel: oneLevel,
        }"
        :sizeMultiplier="sizeMultiplier"
        :props.scaleMultiplier="props.scaleMultiplier"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        :labels="labelsZero"
        @setActionItem="setActionItem"
        @setClickedInfo="setClickedInfo"
        :discNum="discNum"
        :position="position"
      />
      <DrawClickedLine
        v-if="clickedLine.isClicked"
        :clickedLine="clickedLine"
        :params="params"
        :x="xCenter"
        :y="yCenter"
        :flags="{
          showSupportRect: showSupportRect,
          showAdditionalInCircle:showAdditionalInCircle,
          defaultRect: defaultRect,
          showScore: showScore,
          showLight: showLight,
          oneLevel: oneLevel,
        }"
        :sizeMultiplier="sizeMultiplier"
        :props.scaleMultiplier="props.scaleMultiplier"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        :labels="labelsZero"
        @setActionItem="setActionItem"
        @setClickedInfo="setClickedInfo"
        :discNum="discNum"
        :position="position"
      />
      <DrawClickedSector
        v-if="clickedSector.isClicked"
        :x="xCenter"
        :y="yCenter"
        :clickedSector="clickedSector"
        :params="params"
        bgColor='gray'
        :props.scaleMultiplier="props.scaleMultiplier"
        :sizeMultiplier="sizeMultiplier"
        :flags="{
          showSupportRect: showSupportRect,
          showAdditionalInCircle:showAdditionalInCircle,
          defaultRect: defaultRect,
          showScore: showScore,
          showLight: showLight,
        }"
        @setClickedInfo="setClickedInfo"
        @setClickedSector="setClickedSector"
      />
    </v-layer-->
  </v-stage>
</template>

<style scoped>

</style>
