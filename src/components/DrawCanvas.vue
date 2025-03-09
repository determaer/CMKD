<script setup>
import { ref, provide, onMounted, computed, watch } from 'vue'
import { useParamStore } from '../store/paramStore'
import DrawLabels from './DrawLabels.vue'
import DrawLineBtwElements from './DrawLineBtwElements.vue'
import DrawBase from './DrawBase.vue'
import DrawClickedElement from './DrawClickedElement.vue'
import DrawClickedLine from './DrawClickedLine.vue'
import DrawClickedSector from './DrawClickedSector.vue'
import DrawArrows from './DrawArrows.vue'

const store = useParamStore()

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

const clickLayerX = ref(-1000)
const clickLayerY = ref(-1000)

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
const clickedSector = ref({
  isClicked: false,
  sector: null,
})

watch(
  () => props.dialogSized,
  () => {
    if (props.dialogSized) {
      store.x = store.width / 4.4
      store.y = store.width / 4.4
    }
    else {
      store.x = store.width / 2
      store.y = store.width / 2
    }
  },
  {immediate: true}
)

watch(
  () => props.position,
  () => {
    store.position = props.position
  },
  {immediate: true}
)

watch(
  () => {props.drawingMode, props.extShowSupportRect},
  () => {
    if (props.drawingMode == 'default') {
      store.showSupportRect = false
      store.showAdditionalInCircle = true
      store.showScore = false
      store.defaultRect = false
      store.showLight = false
      if (props.oneLevel) store.showSectorName = true
    }
    if (props.drawingMode == 'default+') {
      store.showSupportRect = true
      store.showAdditionalInCircle = false
      store.showScore = false
      store.defaultRect = false
      store.showLight = false
      if (props.oneLevel) store.showSectorName = true
    }
    if (props.drawingMode == 'score') {
      store.showSupportRect = props.extShowSupportRect
      store.showAdditionalInCircle = false
      store.showScore = true
      store.defaultRect = false
      store.showLight = false
      if (props.oneLevel) store.showSectorName = true
      }
    if (props.drawingMode == 'light') {
      store.showSupportRect = props.extShowSupportRect
      store.showAdditionalInCircle = false
      store.showScore = true
      store.defaultRect = false
      store.showLight = true
      if (props.oneLevel) store.showSectorName = true
    }
  },
  {immediate: true}
)

const calcParams = () => {
  let arrLabelAngles = [],
  arrInAngles = [],
  arrOutAngles = [],
  arrArrowsAngles = [],
  arrDividerAngles = []
  for (let i = 1; i <= store.discNum * 2; i = i + 2) {
    let t = i * (360 / (store.discNum * 2)) + 90
    arrLabelAngles.push(t)
  }
  console.log(store.pointNum, store.discNum)
  for (let i = 1; i < store.pointNum; i = i + store.circleDivider) {
    let tIn = (i + 1) * (360 / store.pointNum) + 90 //+ (4 - 4 ** sizeMultiplier)
    let tOut = (i + 2) * (360 / store.pointNum) + 90 //- (4 - 4 ** sizeMultiplier)
    let tArrow = tIn - 2 * store.sizeMultiplier
    arrArrowsAngles.push(tArrow)
    arrInAngles.push(tOut)
    arrOutAngles.push(tIn)
  }
  let arrAngles = []
  for (let i = 0; i < store.discNum; i = i + 1) {
    arrAngles.push({
      labelId: store.labelsZero[i].index,
      inAngle: arrInAngles[i],
      outAngle: arrOutAngles[i],
      labelAngle: arrLabelAngles[i],
      arrowAngle: arrArrowsAngles[i],
    })
  }
  arrDividerAngles.push(90)
  for (let i = 0; i < store.discNum - 1; i = i + 1) {
    if (store.labelsZero[i].prop !== store.labelsZero[i + 1].prop) {
      arrDividerAngles.push(
        arrLabelAngles[i] + (arrLabelAngles[i + 1] - arrLabelAngles[i]) / 2
      )
    }
  }
  const add = store.discNum < 50 ? 0 : 50
  store.params = ({
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
    
const calcSectors = () => {
  for (let i = store.circleNum; i >= 0; i = i - 1) {
    console.log(store.params)
    let sectorsAngles = []
    let sectorsLabels = []
    let currentAngle = 0
    sectorsAngles.push(0)

    if (store.params.angles.length > 0) {
      if (i == 0) {
        let sectorsAngles = []
        let sectorsLabels = []
        let start, end1, upperID, shortname
        sectorsAngles.push(0)
        if (store.params.angles.length > 0) {
          store.labelsZero.map((label) => {
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
                let angle1 = store.params.angles.find(
                  (lAngle) => lAngle.labelId === end + 1
                ).labelAngle
                let angle2 = store.params.angles.find(
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
            store.sectors.push({
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
              currentAngle + 360 * (label.secLength / store.discNum)
            )
            currentAngle = currentAngle + 360 * (label.secLength / store.discNum)
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
          store.sectors.push({
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
  () => {props.scaleMultiplier, store.sizeMultiplier},
  () => {
    calcParams()
    calcSectors()
    store.scaleMultiplier = props.scaleMultiplier
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
  store.circleNum = tLevel
  store.discNum = t
  store.labelsZero = labelsZeroLevel

  store.labelsZero.map((label, from) => {
    if (label.connections.length !== 0) {
      label.connections.map((to) => {
        if (props.labels.some((elem) => elem.id == to)){
          if ((store.showLight && (props.redFlags.some((elem_id) => elem_id == to) ||
            (label.score < 0 && label.isBase == true))) || !store.showLight ||
            (props.oneLevel && label.drawAnyCase)){
              store.lines.push({
                objLabelOut: store.labelsZero[from],
                objLabelIn: store.labelsZero.find((x) => x.id === to),
              })
          }
        }
      })
    }
  })
  calcParams()
  calcSectors()
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
    v-if="store.params.angles.length > 0"
    :scale="store.scaleMultiplier"
    :width="store.width"
    :height="store.height"
    ref='stageRef'
    @click="() => {
      console.log('www')
    }"
  >
    <v-layer>
      <v-rect
        fill='white'
        :x="store.x - store.width"
        :y="store.y - store.height"
        :width="store.width * store.scaleMultiplier * 3"
        :height="store.height * store.scaleMultiplier * 3"
      />
      <DrawBase
        bgColor='#dad0f1'
        bgColor2='#e8e8e8'
        @setClickedInfo="setClickedInfo"
        @setClickedSector="setClickedSector"
      />
      <DrawLineBtwElements
        v-for="line of store.lines"
        :objLabelOut="line.objLabelOut"
        :objLabelIn="line.objLabelIn"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        @setActionItem="setActionItem"
        @setClickedInfo="setClickedInfo"
      />
      <DrawArrows />
      <DrawLabels
        v-for="label of store.labelsZero"
        :objLabel="label"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        @setActionItem=setActionItem
        @setClickedInfo="setClickedInfo"
      />
    </v-layer>
    <v-layer
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
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        @setActionItem="setActionItem"
        @setClickedInfo="setClickedInfo"
      />
      <DrawClickedLine
        v-if="clickedLine.isClicked"
        :clickedLine="clickedLine"
        @setClickedElement="setClickedElement"
        @setClickedLine="setClickedLine"
        @setActionItem="setActionItem"
        @setClickedInfo="setClickedInfo"
      />
      <DrawClickedSector
        v-if="clickedSector.isClicked"
        :clickedSector="clickedSector"
        bgColor='gray'
        @setClickedInfo="setClickedInfo"
        @setClickedSector="setClickedSector"
      />
    </v-layer>
  </v-stage>
</template>

<style scoped>

</style>
