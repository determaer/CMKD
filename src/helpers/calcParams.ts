import { useParamStore } from "../store/paramStore";
import type { Angle } from "../types/angle";
const store = useParamStore();

export const calcParams = () => {
  // расчёт опорных углов и окружностей
  const arrLabelAngles: number[] = [],
    arrInAngles: number[] = [],
    arrOutAngles: number[] = [],
    arrArrowsAngles: number[] = [],
    arrDividerAngles: number[] = [90],
    arrAngles: Angle[] = [];

  for (let i = 1; i <= store.discNum.value * 2; i = i + 2) {
    arrLabelAngles.push(i * (360 / (store.discNum.value * 2)) + 90);
  }

  for (let i = 1; i < store.pointNum.value; i = i + store.circleDivider) {
    const tIn = (i + 1) * (360 / store.pointNum.value) + 90;
    const tOut = (i + 2) * (360 / store.pointNum.value) + 90;
    const tArrow = tIn - 2 * store.sizeMultiplier.value;
    arrArrowsAngles.push(tArrow);
    arrInAngles.push(tOut);
    arrOutAngles.push(tIn);
  }

  for (let i = 0; i < store.discNum.value; i = i + 1) {
    if (
      store.discNum.value < i - 1 &&
      store.labelsZero.value[i]?.prop !== store.labelsZero.value[i + 1]?.prop
    ) {
      const firstArrLabelAngle = arrLabelAngles[i] ?? 0;
      const secondArrLabelAngle = arrLabelAngles[i + 1] ?? 0;
      arrDividerAngles.push(
        firstArrLabelAngle + (secondArrLabelAngle - firstArrLabelAngle) / 2,
      );
    }
    arrAngles.push({
      labelId: store.labelsZero.value[i]?.index ?? 0,
      inAngle: arrInAngles[i] ?? 0,
      outAngle: arrOutAngles[i] ?? 0,
      labelAngle: arrLabelAngles[i] ?? 0,
      arrowAngle: arrArrowsAngles[i] ?? 0,
    });
  }

  const add = store.discNum.value < 50 ? 0 : 50;
  store.params.value = {
    outerRadius: (250 + add) * store.scaleMultiplier.value,
    innerRadius: (200 + add) * store.scaleMultiplier.value,
    labelRadius: (225 + add) * store.scaleMultiplier.value,
    additionalLabelRadius: (285 + add) * store.scaleMultiplier.value,
    linesBtwElementsRadius: (190 + add) * store.scaleMultiplier.value,
    mergingPortsRadius: (212 + add) * store.scaleMultiplier.value,
    sectorNameRadius: (265 + add) * store.scaleMultiplier.value,
    dividerAngles: arrDividerAngles,
    angles: arrAngles,
  };
};
