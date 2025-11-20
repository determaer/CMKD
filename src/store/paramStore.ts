import { ref, computed } from "vue";
import type { Label } from "../types";
import { calcLines } from "../helpers/calcLines";
import { calcAngles } from "../helpers/calcAngles";
import { calcDividerAngles } from "../helpers/calcDividerAngles";
import { calcSectors } from "../helpers/calcSectors";
//#region params
const width = ref(800);
const centerPoint = computed(() => width.value / 2);
const circleNum = computed(() =>
  labels.value.reduce(
    (acc, current) => (acc = current.level > acc ? current.level : acc),
    0,
  ),
);
const discNum = computed(() => labelsZero.value.length);

const manyLabelsCorrection = computed(() => (discNum.value < 50 ? 0 : 50));
const haveSupportsCorrection = computed(() =>
  showSupportRect.value ? 50 * scaleMultiplier.value : 0,
);
const generalCorrection = (baseRadius: number) =>
  (baseRadius + manyLabelsCorrection.value) * scaleMultiplier.value;

const radiuses = computed(() => ({
  outerRadius: generalCorrection(250),
  innerRadius: generalCorrection(200),
  labelRadius: generalCorrection(225),
  additionalLabelRadius: generalCorrection(285),
  lineStartRadius: generalCorrection(190),
  mergingPortsRadius: generalCorrection(212),
  sectorNameRadius: generalCorrection(275) + haveSupportsCorrection.value,
}));

const angles = computed(() =>
  calcAngles(labelsZero.value, sizeMultiplier.value),
);

const dividerAngles = computed(() =>
  calcDividerAngles(angles.value, labelsZero.value),
);

const scaleMultiplier = computed(() => width.value / 800);

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
const reloadCount = ref(0);
//#region flags

const showSupportRect = ref(false);
const showAdditionalInCircle = ref(true);
const defaultRect = ref(true);
const showScore = ref(false);
const showLight = ref(false);
const oneLevel = computed(() => (circleNum.value == 0 ? true : false));
const showImportant = ref(false);
const showDefaultRect = ref(false);
const showSectorName = computed(() => (oneLevel.value ? true : false));

//#region content

const labels = ref<Label[]>([]);
const labelsZero = computed(() =>
  labels.value.filter((label) => label.level == 0),
);
const sectors = computed(() =>
  calcSectors(discNum.value, angles.value, labels.value),
);
const lines = computed(() =>
  calcLines(labelsZero.value, showLight.value, showAdditionalInCircle.value),
);

export const useParamStore = () => {
  function updateCMKD() {
    setTimeout(() => {
      reloadCount.value++;
    }, 0);
  }

  return {
    width,
    centerPoint,
    circleNum,
    discNum,
    angles,
    dividerAngles,
    radiuses,
    scaleMultiplier,
    sizeMultiplier,
    position,
    showSupportRect,
    showDefaultRect,
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
    reloadCount,
    updateCMKD,
  };
};
