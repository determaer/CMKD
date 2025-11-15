import type { Angle } from "../types/angle";

export const calcAngles = (
  discNum: number,
  pointNum: number,
  circleDivider: number,
  sizeMultiplier: number,
) => {
  const labelAngles: number[] = [],
    inAngles: number[] = [],
    outAngles: number[] = [],
    arrowsAngles: number[] = [],
    angles: Angle[] = [];

  for (let i = 1; i <= discNum * 2; i = i + 2) {
    labelAngles.push(i * (360 / (discNum * 2)) + 90);
  }

  for (let i = 1; i < pointNum; i = i + circleDivider) {
    const tIn = (i + 1) * (360 / pointNum) + 90;
    const tOut = (i + 2) * (360 / pointNum) + 90;
    const tArrow = tIn - 2 * sizeMultiplier;
    arrowsAngles.push(tArrow);
    inAngles.push(tOut);
    outAngles.push(tIn);
  }

  for (let i = 0; i < discNum; i = i + 1) {
    angles.push({
      labelId: i,
      inAngle: inAngles[i] ?? 0,
      outAngle: outAngles[i] ?? 0,
      labelAngle: labelAngles[i] ?? 0,
      arrowAngle: arrowsAngles[i] ?? 0,
    });
  }

  return angles;
};
