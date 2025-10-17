import { ref } from 'vue';
import type { Info, Label, Sector, Line } from '../types';

const clickLayerX = ref(-1000)
  const clickLayerY = ref(-1000)
  
  const isClickedLine = ref(false)
  const isClickedElement = ref(false)
  const isClickedSector = ref(false)

  const clickedLine = ref<Line>()
  
  const clickedElement = ref<{
    objLabel: Label, //содержит внутри объекта id элементов далее
    prevLabels: Label[], //стрелка к ним
    nextLabels: Label[], //стрелка от них
  }>()

  const clickedSector = ref<Sector>()

  const clickedInfo = ref<Info>()

export const useClickedStore = () => {

  const resetClicked = () => {
    isClickedLine.value = false
    isClickedElement.value = false
    isClickedSector.value = false
  }

  return{
    clickLayerX,
    clickLayerY,
    clickedLine,
    clickedElement,
    clickedSector,
    clickedInfo,
    isClickedLine,
    isClickedElement,
    isClickedSector,
    resetClicked,
  }
}
