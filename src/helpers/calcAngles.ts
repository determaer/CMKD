import type { Label } from "../types";
import type { Angle } from "../types/angle";

export const calcAngles = (labels: Label[], sizeMultiplier: number) => {
  const circleDivider = 5;
  const labelsZero = labels.filter((label) => label.level == 0);
  const discNum = labelsZero.length;
  const pointNum = discNum * circleDivider;
  const angles: Angle[] = [];

  for (let i = 1; i <= discNum; i = i + 1) {
    const outAngle = ((i - 1) * circleDivider + 2) * (360 / pointNum) + 90;
    angles.push({
      labelId: labelsZero[i - 1]?.id ?? i - 1,
      inAngle: ((i - 1) * circleDivider + 3) * (360 / pointNum) + 90,
      outAngle: outAngle,
      labelAngle: (i * 2 - 1) * (360 / (discNum * 2)) + 90,
      arrowAngle: outAngle - 2 * sizeMultiplier,
    });
  }

  return angles;
};
