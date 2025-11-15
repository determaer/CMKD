import type { Angle } from "../types/angle";
import { defaultLabel, type Label } from "../types/label";
import type { Sector, SectorLabel } from "../types/sector";

export const calcSectors = (
  circleNum: number,
  discNum: number,
  angles: Angle[],
  labelsZero: Label[],
  labels: Label[],
) => {
  const sectors: Sector[] = [];

  for (let i = circleNum; i >= 0; i = i - 1) {
    const sectorsAngles: number[] = [0];
    const sectorsLabels: SectorLabel[] = [];
    let currentAngle = 0;

    if (angles.length > 0) {
      if (i == 0) {
        // классическая карта или нижний уровень сводной карты
        let start: number;
        if (angles.length > 0) {
          labelsZero.map((label, index) => {
            if (label.secStart) start = index;
            if (label.secEnd) {
              const end = index;

              if (end != labels.length - 1) {
                const angle1 = angles.find(
                  (lAngle) => lAngle.labelId === end + 1,
                )?.labelAngle;
                const angle2 = angles.find(
                  (lAngle) => lAngle.labelId === end,
                )?.labelAngle;
                if (angle1 && angle2) {
                  const angle = angle2 + (angle1 - angle2) / 2 - 90;
                  sectorsAngles.push(angle);
                }
              }

              sectorsLabels.push({
                sStartLID: start,
                sEndLID: index,
                sLevel: 0,
                shortname: label.sectorName,
                object: label,
              });
            }
          });
        }
        sectorsAngles.push(359.99);
      } else {
        // верхние уровни сводной карты
        labels.map((label, index) => {
          if (label.level == i && label.secLength) {
            let nextAngle = currentAngle + 360 * (label.secLength / discNum);
            if (nextAngle == 360) nextAngle = 359.99;
            sectorsAngles.push(nextAngle);
            currentAngle = nextAngle;
            sectorsLabels.push({
              sStartLID: index,
              sEndLID: index,
              sLevel: i,
              object: label,
            });
          }
        });
      }
    }

    if (sectorsLabels.length > 0) {
      for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
        sectors.push({
          sStart: sectorsAngles[i] ?? 0,
          sEnd: sectorsAngles[i + 1] ?? 0,
          sStartLID: sectorsLabels[i]?.sStartLID ?? 0,
          sEndLID: sectorsLabels[i]?.sEndLID ?? 0,
          sLevel: sectorsLabels[i]?.sLevel ?? 0,
          object: sectorsLabels[i]?.object ?? defaultLabel,
          shortname: sectorsLabels[i]?.shortname,
        });
      }
    }
  }

  return sectors;
};
