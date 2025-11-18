import type { Label } from "../types";
import type { Angle } from "../types/angle";

export const calcAngles = (labels: Label[], sizeMultiplier: number) => {
  const circleDivider = 5;
  const discNum = labels.length;
  const pointNum = discNum * circleDivider;
  const angles: Angle[] = [];

  labels.forEach((label, index) => {
    const outAngle = (index * circleDivider + 2) * (360 / pointNum) + 90;
    angles.push({
      labelId: label.id,
      inAngle: (index * circleDivider + 3) * (360 / pointNum) + 90,
      outAngle: outAngle,
      labelAngle: ((index + 1) * 2 - 1) * (360 / (discNum * 2)) + 90,
      arrowAngle: outAngle - 2 * sizeMultiplier,
    });
  });

  return angles;
};
