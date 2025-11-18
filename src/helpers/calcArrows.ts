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
  labels.forEach((label, index) => {
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
    if (label.arrowOut) {
      const startAngle = angles.find(
        (lAngle) => lAngle.labelId === label.id,
      )?.labelAngle;

      const endAngle = angles.find(
        (lAngle) => lAngle.labelId === labels[index + 1]?.id,
      )?.labelAngle;
      if (startAngle && endAngle) {
        arcBtwLabels.push({
          angle: startAngle - endAngle,
          rotation: -startAngle,
        });
      }
    }
  });
  return {
    arrowsInLabels,
    arcBtwLabels,
  };
};
