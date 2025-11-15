import type { Label } from "../types";
import type { Angle } from "../types/angle";

export const calcDividerAngles = (
  discNum: number,
  angles: Angle[],
  labels: Label[],
) => {
  const dividerAngles: number[] = [90];

  for (let i = 0; i < discNum - 1; i = i + 1) {
    if (labels[i]?.prop !== labels[i + 1]?.prop) {
      const firstArrLabelAngle = angles[i]?.labelAngle ?? 0;
      const secondArrLabelAngle = angles[i + 1]?.labelAngle ?? 0;
      dividerAngles.push(
        firstArrLabelAngle + (secondArrLabelAngle - firstArrLabelAngle) / 2,
      );
    }
  }

  return dividerAngles;
};
