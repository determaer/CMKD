import { defineStore } from 'pinia';
import { reactive, ref, computed } from 'vue';

export const useParamStore = defineStore('paramStore', () => {

  //#region params
  const width = ref(800)
  const height = ref(800)
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
    angles: [],
    dividerAngles: [],
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

  //#region content

  const labelsZero = ref([])
  const sectors = ref([])
  const lines = ref([])

  return {
    width,
    height,
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
    labelsZero,
    sectors,
    lines,
  };
});
