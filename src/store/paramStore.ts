import { ref, computed } from 'vue';
import { Sector } from '../types/sector';
import { Label } from '../types/label';
import { Line } from '../types/line';

//#region params
const width = ref(800)
const x = ref(0)
const y = ref(0)
const circleNum = ref(0)
const discNum = ref(0)
const circleDivider = 5
const pointNum = computed(() => {return discNum.value * circleDivider})

const params = ref({
  outerRadius: 0, //внешний радиус окружности диаграммы
  innerRadius: 0, //внутренний радиус окружности диаграммы
  labelRadius: 0, //радиус расположения элементов
  additionalLabelRadius: 0, //радиус расположения дополнительных элементов
  linesBtwElementsRadius: 0, //радиус конечных точек для линий-соединителей
  mergingPortsRadius: 0, //радиус на котором начинается слияние портов элемента
  sectorNameRadius: 0,
  angles: <any[]>[],
  dividerAngles: <number[]>[],
})

const scaleMultiplier = ref(1)
const sizeMultiplier = computed(() => {
  if (discNum.value <= 10) return 1
  if (discNum.value > 10 && discNum.value < 20) return 0.9
  if (discNum.value >= 20 && discNum.value < 30) return 0.8
  if (discNum.value >= 30 && discNum.value < 40) return 0.75
  if (discNum.value >= 40 && discNum.value < 50) return 0.7
  if (discNum.value >= 50) return 0.65
  else return 1
})

const position = ref()

//#region flags

const showSupportRect = ref()
const showAdditionalInCircle = ref(true)
const defaultRect = ref(true)
const showScore = ref(false)
const showLight = ref(false)
const showSectorName = ref(false)
const oneLevel = ref()
const showImportant = ref()

//#region content

const labels = ref<Label[]>([])
const labelsZero = ref<Label[]>([])
const sectors = ref<Sector[]>([])
const lines = ref<Line[]>([])

export const useParamStore =  () => {

  function resetParams() {
    labels.value = []
    labelsZero.value = []
    sectors.value = []
    lines.value = []
    discNum.value = 0
    circleNum.value = 0
    
    params.value = {
      outerRadius: 0, 
      innerRadius: 0, 
      labelRadius: 0, 
      additionalLabelRadius: 0, 
      linesBtwElementsRadius: 0, 
      mergingPortsRadius: 0, 
      sectorNameRadius: 0,
      angles: [],
      dividerAngles: [],
    }
    console.log(labels.value, params.value)
  }

  return {
    width,
    x,
    y,
    circleDivider,
    circleNum,
    discNum,
    pointNum,
    params,
    scaleMultiplier,
    sizeMultiplier,
    position,
    showSupportRect,
    showAdditionalInCircle,
    defaultRect,
    showScore,
    showLight,
    showSectorName,
    oneLevel,
    showImportant,
    labels,
    labelsZero,
    sectors,
    lines,
    resetParams,
  };
}
