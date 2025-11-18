import type { Angle } from "../types/angle";
import { type Label } from "../types/label";
import type { Sector, SectorLabel } from "../types/sector";

export const calcSectors = (
  circleNum: number,
  discNum: number,
  angles: Angle[],
  labels: Label[],
) => {
  const sectors: Sector[] = [];

  for (let i = circleNum; i >= 0; i = i - 1) {
    const sectorsAngles: number[] = [0];
    const sectorsLabels: SectorLabel[] = [];
    let currentAngle = 0;

    labels.forEach((label, index) => {
      if (i == 0 && label.level == 0 && label.secEnd) {
        if (index != labels.length - 1) {
          const angle1 = angles.find(
            (lAngle) => lAngle.labelId === labels[index + 1]?.id,
          )?.labelAngle;
          const angle2 = angles.find(
            (lAngle) => lAngle.labelId === label.id,
          )?.labelAngle;
          if (angle1 && angle2) {
            const angle = angle2 + (angle1 - angle2) / 2 - 90;
            sectorsAngles.push(angle);
          }
        } else sectorsAngles.push(359.99);

        sectorsLabels.push({
          sLevel: i,
          shortname: label.sectorName,
          object: {
            id: label.id,
          },
        });
      } else if (i > 0 && label.level == i && label.secLength != undefined) {
        let nextAngle = currentAngle + 360 * (label.secLength / discNum);
        if (nextAngle == 360) nextAngle = 359.99;
        sectorsAngles.push(nextAngle);
        currentAngle = nextAngle;
        sectorsLabels.push({
          sLevel: i,
          shortname: label.typeText + label.numText,
          object: {
            id: label.id,
            isLabel: label.isLabel,
            fontStyle: label.fontStyle,
            numText: label.numText,
            typeText: label.typeText,
            score: label.score,
          },
        });
      }
    });

    for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
      sectors.push({
        sStart: sectorsAngles[i] ?? 0,
        sEnd: sectorsAngles[i + 1] ?? 0,
        sLevel: sectorsLabels[i]?.sLevel ?? 0,
        object: sectorsLabels[i]?.object ?? { id: 0 },
        shortname: sectorsLabels[i]?.shortname,
      });
    }
  }

  return sectors;
};
