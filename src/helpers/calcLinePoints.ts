import type { Label } from "../types/label";
import { useParamStore } from "../store/paramStore";
import { calcControlPoint } from "./calcControlPoint";
const store = useParamStore();

export const calcLinePoint = (objLabelIn: Label, objLabelOut: Label) => {
  const labelInIndex = store.labelsZero.value.findIndex(
    (label) => objLabelIn.id == label.id,
  );
  const labelOutIndex = store.labelsZero.value.findIndex(
    (label) => objLabelOut.id == label.id,
  );
  const inAngles = store.angles.value.find(
    (lAngle) => lAngle.labelId === labelInIndex,
  );
  const outAngles = store.angles.value.find(
    (lAngle) => lAngle.labelId === labelOutIndex,
  );
  if (inAngles == undefined || outAngles == undefined) return [];

  const discNumCorrection = store.discNum.value >= 50 ? 1 : 0;

  const diff = Math.abs(outAngles.outAngle - inAngles.inAngle);

  const outAngle =
    outAngles.outAngle >= 300 ? outAngles.outAngle - 360 : outAngles.outAngle;

  const inAngle =
    inAngles.inAngle >= 300 ? inAngles.inAngle - 360 : inAngles.inAngle;

  const bezierCPangle1 =
    diff < 180 ? outAngle + diff / 250 : outAngle - diff / 250;

  const bezierCPangle2 =
    diff < 180 ? inAngle - diff / 250 : inAngle + diff / 250;

  const angleCorrection =
    diff < 180 ? (180 - diff) / 10 : (180 - Math.abs(diff - 360)) / 10;

  const radius =
    (10 * angleCorrection + 50 * discNumCorrection) *
    store.scaleMultiplier.value;

  const [bezierCPX1, bezierCPY1] = calcControlPoint(radius, bezierCPangle1);
  const [bezierCPX2, bezierCPY2] = calcControlPoint(radius, bezierCPangle2);
  const [outX, outY] = calcControlPoint(
    store.radiuses.value.innerRadius,
    outAngle,
  );
  const [inX, inY] = calcControlPoint(
    store.radiuses.value.linesBtwElementsRadius,
    inAngle,
  );

  return [outX, outY, bezierCPX1, bezierCPY1, bezierCPX2, bezierCPY2, inX, inY];
};
