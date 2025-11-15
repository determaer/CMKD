import { useParamStore } from "../store/paramStore";
import { calcControlPoint } from "./calcControlPoint";
const store = useParamStore();

export type Arrow = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type Arc = {
  angle: number;
  rotation: number;
};

export const calcArrows = () => {
  const arrowsInLabels: Arrow[] = [];
  const arcBtwLabels: Arc[] = [];
  store.labelsZero.value.forEach((label, index) => {
    if (label.arrowIn) {
      const lAngle = store.angles.value.find(
        (lAngle) => lAngle.labelId === index,
      );
      if (lAngle) {
        const [startX, startY] = calcControlPoint(
          store.radiuses.value.labelRadius,
          lAngle.arrowAngle - 1,
        );
        const [endX, endY] = calcControlPoint(
          store.radiuses.value.labelRadius,
          lAngle.arrowAngle,
        );
        if (store.showAdditionalInCircle.value || label.isBase)
          arrowsInLabels.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
          });
      }
    }
    if (label.arrowOut) {
      const startAngle = store.angles.value.find(
        (lAngle) => lAngle.labelId === index,
      )?.labelAngle;

      const endAngle = store.angles.value.find(
        (lAngle) => lAngle.labelId === index + 1,
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
