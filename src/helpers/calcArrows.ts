import type { Label } from "../types";
import type { Angle } from "../types/angle";
import { calcControlPoint } from "./calcControlPoint";

type Arrow = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type Arc = {
  angle: number;
  rotation: number;
};

export const calcArrows = (
  labels: Label[],
  angles: Angle[],
  showAdditionalInCircle: boolean,
  centerPoint: number,
  labelRadius: number,
) => {
  const arrowsInLabels: Arrow[] = [];
  const arcBtwLabels: Arc[] = [];
  let prevLabel: Label;
  labels.forEach((label, index) => {
    if (index == 0) {
      prevLabel = label;
      return;
    }
    if (label.arrowIn && (showAdditionalInCircle || label.isBase)) {
      const lAngle = angles.find((lAngle) => lAngle.labelId === label.id);
      if (lAngle) {
        const [startX, startY] = calcControlPoint(
          centerPoint,
          labelRadius,
          lAngle.arrowAngle - 1,
        );
        const [endX, endY] = calcControlPoint(
          centerPoint,
          labelRadius,
          lAngle.arrowAngle,
        );
        arrowsInLabels.push({
          startX: startX,
          startY: startY,
          endX: endX,
          endY: endY,
        });
      }
    }
    if (prevLabel.arrowOut) {
      const startAngle = angles.find(
        (lAngle) => lAngle.labelId === prevLabel.id,
      )?.labelAngle;

      const endAngle = angles.find(
        (lAngle) => lAngle.labelId === label.id,
      )?.labelAngle;
      if (startAngle && endAngle) {
        arcBtwLabels.push({
          angle: startAngle - endAngle,
          rotation: -startAngle,
        });
      }
    }
    prevLabel = label;
  });
  return {
    arrowsInLabels,
    arcBtwLabels,
  };
};
