import { ref, computed, type ComputedRef } from "vue";
import type { Info, Label, Sector, Line } from "../types";
import { useParamStore } from "../store/paramStore";
import type { SelectableLabel } from "../types/label";

const store = useParamStore();
const clickLayerX = ref(-1000);
const clickLayerY = ref(-1000);

const isClickedLine = ref(false);
const isClickedLabel = ref(false);
const isClickedSector = ref(false);

const clickedLine = ref<Line>();

const clickedLabel = ref<{
  objLabel: SelectableLabel; //содержит внутри объекта id элементов далее
  prevLabels: SelectableLabel[]; //стрелка к ним
  nextLabels: SelectableLabel[]; //стрелка от них
}>();

const labelsToDraw: ComputedRef<SelectableLabel[]> = computed(() => {
  if (clickedLabel.value != undefined)
    return [
      clickedLabel.value.objLabel,
      ...clickedLabel.value.prevLabels,
      ...clickedLabel.value.nextLabels,
    ];
  return [];
});

const linesToDraw = computed(() => {
  const lines: Line[] = [];

  clickedLabel.value?.nextLabels.map((nLabel) => {
    if (clickedLabel.value?.objLabel)
      lines.push({
        objLabelIn: clickedLabel.value?.objLabel.label,
        objLabelOut: nLabel.label,
      });
  });
  clickedLabel.value?.prevLabels.map((pLabel) => {
    if (clickedLabel.value?.objLabel)
      lines.push({
        objLabelIn: pLabel.label,
        objLabelOut: clickedLabel.value?.objLabel.label,
      });
  });

  return lines;
});

const clickedSector = ref<Sector>();

const clickedInfo = ref<Info>();

export const useClickedStore = () => {
  function resetClicked() {
    isClickedLine.value = false;
    isClickedLabel.value = false;
    isClickedSector.value = false;
  }

  function setClickedLabel(label: Label) {
    let arrPrevLabels: SelectableLabel[] = [];
    let arrNextLabels: SelectableLabel[] = [];
    store.labelsZero.value.map((otherLabel) => {
      otherLabel.connections.map((connection) => {
        if (label.id === connection) {
          arrNextLabels.push({
            label: otherLabel,
            selected: false,
          });
        }
      });
    });
    label.connections.map((connection) => {
      const label = store.labelsZero.value.find(
        (label) => label.id === connection,
      );
      if (label)
        arrPrevLabels.push({
          label: label,
          selected: false,
        });
    });

    isClickedLine.value = false;
    isClickedSector.value = false;
    isClickedLabel.value = true;

    clickedLabel.value = {
      objLabel: { label: label, selected: true },
      nextLabels: arrNextLabels,
      prevLabels: arrPrevLabels,
    };
    clickedInfo.value = {
      type: "label",
      object: label,
      nextLabels: arrNextLabels,
      prevLabels: arrPrevLabels,
    };
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
    labelsToDraw,
    linesToDraw,
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

