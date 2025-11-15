import { ref } from "vue";
import type { Info, Label, Sector, Line } from "../types";
import { useParamStore } from "../store/paramStore";

const store = useParamStore();
const clickLayerX = ref(-1000);
const clickLayerY = ref(-1000);

const isClickedLine = ref(false);
const isClickedLabel = ref(false);
const isClickedSector = ref(false);

const clickedLine = ref<Line>();

const clickedLabel = ref<{
  objLabel: Label; //содержит внутри объекта id элементов далее
  prevLabels: Label[]; //стрелка к ним
  nextLabels: Label[]; //стрелка от них
}>();

const clickedSector = ref<Sector>();

const clickedInfo = ref<Info>();

export const useClickedStore = () => {
  function resetClicked() {
    isClickedLine.value = false;
    isClickedLabel.value = false;
    isClickedSector.value = false;
  }

  function setClickedLabel(label: Label) {
    let arrPrevLabels: Label[] = [];
    let arrNextLabels: Label[] = [];
    store.labelsZero.value.map((label) => {
      if (label.connections.length !== 0) {
        label.connections.map((connection) => {
          if (label.id === connection) {
            arrPrevLabels.push(label);
          }
        });
      }
    });
    label.connections.map((connection) => {
      let label = store.labelsZero.value.find(
        (label) => label.id === connection,
      );
      if (label) arrNextLabels.push(label);
    });

    isClickedLine.value = false;
    isClickedSector.value = false;
    isClickedLabel.value = true;

    clickedLabel.value = {
      objLabel: label,
      prevLabels: arrNextLabels,
      nextLabels: arrPrevLabels,
    };
    clickedInfo.value = {
      type: "label",
      object: label,
      prevLabels: arrNextLabels,
      nextLabels: arrPrevLabels,
    };
    console.log(clickedInfo.value);
  }

  function setClickedLine(labelIn: Label, labelOut: Label) {
    isClickedLine.value = true;
    isClickedSector.value = false;
    isClickedLabel.value = false;

    clickedLine.value = {
      objLabelIn: labelIn,
      objLabelOut: labelOut,
    };
    clickedInfo.value = {
      type: "line",
      object: {
        objLabelIn: labelIn,
        objLabelOut: labelOut,
      },
    };
  }

  function setClickedSector(sector: Sector) {
    isClickedLine.value = false;
    isClickedSector.value = true;
    isClickedLabel.value = false;

    clickedSector.value = sector;
    clickedInfo.value = {
      type: "sector",
      object: sector,
    };
  }

  return {
    clickLayerX,
    clickLayerY,
    clickedLine,
    clickedLabel,
    clickedSector,
    clickedInfo,
    isClickedLine,
    isClickedLabel,
    isClickedSector,
    resetClicked,
    setClickedLabel,
    setClickedLine,
    setClickedSector,
  };
};

