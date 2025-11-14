import { ref, computed } from "vue";
import type { Label, Sector, Line } from "../types";
import type { Angle } from "../types/angle";
//#region params
const width = ref(800);
const x = ref(0);
const y = ref(0);
const circleNum = ref(0);
const discNum = ref(0);
const circleDivider = 5;
const pointNum = computed(() => {
  return discNum.value * circleDivider;
});

const manyLabelsCorrection = computed(() => (discNum.value < 50 ? 0 : 50));
const haveSupportsCorrection = computed(() => {
  return showSupportRect.value ? 50 : 0;
});

const radiuses = computed(() => {
  const generalCorrection = (baseRadius: number) =>
    (baseRadius + manyLabelsCorrection.value) * scaleMultiplier.value;
  return {
    outerRadius: generalCorrection(250),
    innerRadius: generalCorrection(200),
    labelRadius: generalCorrection(225),
    additionalLabelRadius: generalCorrection(285),
    linesBtwElementsRadius: generalCorrection(190),
    mergingPortsRadius: generalCorrection(212),
    sectorNameRadius: generalCorrection(265) + haveSupportsCorrection.value,
  };
});

const angles = ref({
  angles: <Angle[]>[],
  dividerAngles: <number[]>[],
});

const scaleMultiplier = ref(1);
const sizeMultiplier = computed(() => {
  if (discNum.value <= 10) return 1;
  if (discNum.value > 10 && discNum.value < 20) return 0.9;
  if (discNum.value >= 20 && discNum.value < 30) return 0.8;
  if (discNum.value >= 30 && discNum.value < 40) return 0.75;
  if (discNum.value >= 40 && discNum.value < 50) return 0.7;
  if (discNum.value >= 50) return 0.65;
  else return 1;
});

const position = ref();

//#region flags

const showSupportRect = ref();
const showAdditionalInCircle = ref(true);
const defaultRect = ref(true);
const showScore = ref(false);
const showLight = ref(false);
const oneLevel = ref(false);
const showImportant = ref();

const showSectorName = computed(() => {
  if (oneLevel.value) return true;
  return false;
});

//#region content

const labels = ref<Label[]>([]);
const labelsZero = ref<Label[]>([]);
const sectors = ref<Sector[]>([]);
const lines = ref<Line[]>([]);

export const useParamStore = () => {
  function resetParams() {
    labels.value = [];
    labelsZero.value = [];
    sectors.value = [];
    lines.value = [];
    discNum.value = 0;
    circleNum.value = 0;

    angles.value = {
      angles: [],
      dividerAngles: [],
    };
    console.log(labels.value, angles.value);
  }

  return {
    width,
    x,
    y,
    circleDivider,
    circleNum,
    discNum,
    pointNum,
    angles,
    radiuses,
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
};
