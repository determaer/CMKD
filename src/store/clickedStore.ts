import { defineStore } from 'pinia';
import { reactive, ref, computed } from 'vue';

export const useClickedStore = defineStore('clickedStore', () => {

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

  const actionItem = ref({
    type: '',
    objLabel: null,
  })

  const clickedInfo = ref({
    type: '',
    objLabel: null,
    prevLabels: [],
    nextLabels: [],
  })

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
    actionItem.value = {
      type: '',
      objLabel: null,  
    }
    clickedInfo.value = {
      type: '',
      objLabel: null,
      prevLabels: [],
      nextLabels: [],  
    }
  }

  return{
    clickLayerX,
    clickLayerY,
    clickedLine,
    clickedElement,
    clickedSector,
    actionItem,
    clickedInfo,
    resetClicked,
  }
});
