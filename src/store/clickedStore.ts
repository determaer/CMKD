import { ref } from 'vue';
import type { Label } from '../types';
import type { Sector } from '../types/sector';

const clickLayerX = ref(-1000)
  const clickLayerY = ref(-1000)
  
  const isClickedLine = ref(false)
  const isClickedElement = ref(false)
  const isClickedSector = ref(false)

  const clickedLine = ref<{
    objLabelIn: Label,
    objLabelOut: Label
  }>()
  
  const clickedElement = ref<{
    objLabel: Label, //содержит внутри объекта id элементов далее
    prevLabels: Label[], //стрелка к ним
    nextLabels: Label[], //стрелка от них
  }>()

  const clickedSector = ref<Sector>()

  const clickedInfo = ref<{
    type: 'supportLabel' | 'sector' | 'line' | 'label',
    objLabel?: Label,
    prevLabels?: Label[],
    nextLabels?: Label[],
    object?: object,
  }>()

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
