import type { Label } from "../types";
import type { Angle } from "../types/angle";

export const calcDividerAngles = (angles: Angle[], labels: Label[]) => {
  const dividerAngles: number[] = [90];
  let prevLabel: Label;
  labels.forEach((label, index) => {
    if (index == 0) {
      prevLabel = label;
      return;
    }
    if (prevLabel.prop !== label.prop) {
      const prevLabelAngle =
        angles.find((angle) => angle.labelId == prevLabel.id)?.labelAngle ?? 0;
      const labelAngle =
        angles.find((angle) => angle.labelId == label.id)?.labelAngle ?? 0;
      dividerAngles.push(prevLabelAngle + (labelAngle - prevLabelAngle) / 2);
    }
    prevLabel = label;
  });

  return dividerAngles;
};
