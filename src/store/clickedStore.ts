import { ref } from 'vue';

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

  const clickedInfo = ref({
    type: '',
    objLabel: null,
    prevLabels: [],
    nextLabels: [],
  })

export const useClickedStore = () => {

  const resetClicked = () => {
    clickedLine.value = {
      isClicked: false,
      objLabelIn: null,
      objLabelOut: null,
    }
    clickedElement.value = {
      isClicked: false,
      objLabel: null,
      prevLabels: null, 
      nextLabels: null,
    }
    clickedSector.value = {
      isClicked: false,
      sector: null,
    }
  }

  return{
    clickLayerX,
    clickLayerY,
    clickedLine,
    clickedElement,
    clickedSector,
    clickedInfo,
    resetClicked,
  }
}
