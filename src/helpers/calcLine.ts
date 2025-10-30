import type { Label } from "../types/label";
import { useParamStore } from "../store/paramStore";
import { controlPoint } from "./controlPoint";
const store = useParamStore();

export const calcLine = (objLabelIn: Label, objLabelOut: Label) => {
  const radiusCorrection = store.discNum.value >= 50 ? 1 : 0;
  const objLabelInAngles = store.params.value.angles.find(
    (lAngle) => lAngle.labelId === objLabelIn.index
  );
  const objLabelOutAngles = store.params.value.angles.find(
    (lAngle) => lAngle.labelId === objLabelOut.index
  );
  let bezierCPangle1: number,
    bezierCPangle2: number,
    outAngle: number,
    inAngle: number,
    outRadius: number,
    inRadius: number;

  if (objLabelIn.prop !== 0 || objLabelOut.prop !== 0) {
    inRadius = store.params.value.innerRadius;
    outRadius = store.params.value.linesBtwElementsRadius;
    outAngle = objLabelOutAngles?.inAngle ?? 0;
    inAngle = objLabelInAngles?.outAngle ?? 0;
  } else {
    outRadius = store.params.value.innerRadius;
    inRadius = store.params.value.linesBtwElementsRadius;
    outAngle = objLabelOutAngles?.outAngle ?? 0;
    inAngle = objLabelInAngles?.inAngle ?? 0;
  }

  let diff = Math.abs(outAngle - inAngle);
  if (outAngle >= 300) outAngle = outAngle - 360;
  if (inAngle >= 300) inAngle = inAngle - 360;
  let t = 0;
  if (diff < 180) {
    t = (180 - diff) / 10;
    diff = diff / 250;
    bezierCPangle1 = outAngle + diff;
    bezierCPangle2 = inAngle - diff;
  } else {
    t = (180 - Math.abs(diff - 360)) / 10;
    diff = diff / 250;
    bezierCPangle1 = outAngle - diff;
    bezierCPangle2 = inAngle + diff;
  }

  const radius =
    10 * t * store.scaleMultiplier.value +
    50 * radiusCorrection * store.scaleMultiplier.value;
  const [bezierCPX1, bezierCPY1] = controlPoint(radius, bezierCPangle1);
  const [bezierCPX2, bezierCPY2] = controlPoint(radius, bezierCPangle2);
  const [outX, outY] = controlPoint(outRadius, outAngle);
  const [inX, inY] = controlPoint(inRadius, inAngle);

  return [outX, outY, bezierCPX1, bezierCPY1, bezierCPX2, bezierCPY2, inX, inY];
};
