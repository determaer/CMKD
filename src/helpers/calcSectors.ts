import { useParamStore } from "../store/paramStore";
import { defaultLabel } from "../types/label";
import type { SectorLabel } from "../types/sector";
const store = useParamStore();

export const calcSectors = () => {
  // расчёт секторов
  for (let i = store.circleNum.value; i >= 0; i = i - 1) {
    const sectorsAngles: number[] = [];
    const sectorsLabels: SectorLabel[] = [];
    let currentAngle = 0;
    sectorsAngles.push(0);

    if (store.angles.value.length > 0) {
      if (i == 0) {
        // классическая карта или нижний уровень сводной карты
        let start: number;
        if (store.angles.value.length > 0) {
          store.labelsZero.value.map((label, index) => {
            if (label.secStart) start = index;
            if (label.secEnd) {
              const end = index;
              if (end != store.labels.value.length - 1) {
                const angle1 = store.angles.value.find(
                  (lAngle) => lAngle.labelId === end + 1,
                )?.labelAngle;
                const angle2 = store.angles.value.find(
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
        sectorsAngles.push(360);
      } else {
        // верхние уровни сводной карты
        store.labels.value.map((label, index) => {
          if (label.level == i && label.secLength) {
            let nextAngle =
              currentAngle + 360 * (label.secLength / store.discNum.value);
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
        store.sectors.value.push({
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
};
