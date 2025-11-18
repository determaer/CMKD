import type { Angle } from "../types/angle";
import { type Label } from "../types/label";
import type { Sector, SectorLabel } from "../types/sector";

export const calcSectors = (
  discNum: number,
  angles: Angle[],
  labels: Label[],
) => {
  const sectors: Sector[] = [];
  let sectorsAngles: number[];
  let currentLevel: number = 9999;

  labels.forEach((label, index) => {
    if (currentLevel > label.level) {
      currentLevel = label.level;
      sectorsAngles = [0];
    }
    let sectorAngle: number | null = null;
    let sectorLabel: SectorLabel | null = null;
    const prevAngle = sectorsAngles[sectorsAngles.length - 1] ?? 0;

    if (label.level > 0 && label.secLength != undefined) {
      sectorAngle = prevAngle + 360 * (label.secLength / discNum) - 0.0001;
      sectorLabel = {
        sLevel: label.level,
        shortname: label.typeText + label.numText,
        object: {
          id: label.id,
          isLabel: label.isLabel,
          fontStyle: label.fontStyle,
          numText: label.numText,
          typeText: label.typeText,
          score: label.score,
        },
      };
    } else if (label.level == 0 && label.secEnd) {
      sectorAngle = 359.9999;
      if (index != labels.length - 1) {
        const angle1 = angles.find(
          (lAngle) => lAngle.labelId === labels[index + 1]?.id,
        )?.labelAngle;
        const angle2 = angles.find(
          (lAngle) => lAngle.labelId === label.id,
        )?.labelAngle;
        if (angle1 != undefined && angle2 != undefined)
          sectorAngle = angle2 + (angle1 - angle2) / 2 - 90;
      }

      sectorLabel = {
        sLevel: label.level,
        shortname: label.sectorName,
        object: {
          id: label.id,
        },
      };
    } else return;

    sectorsAngles.push(sectorAngle);
    sectors.push({
      sStart: prevAngle,
      sEnd: sectorAngle,
      sLevel: sectorLabel.sLevel,
      object: sectorLabel.object,
      shortname: sectorLabel.shortname,
    });
  });

  return sectors;
};
