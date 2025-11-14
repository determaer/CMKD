import { useParamStore } from "../store/paramStore";
import { controlPoint } from "./controlPoint";
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

export const calcArrows = (arrowsInLabels: Arrow[], arcBtwLabels: Arc[]) => {
  store.labelsZero.value.forEach((label, index) => {
    if (label.arrowIn) {
      const lAngle = store.angles.value.angles.find(
        (lAngle) => lAngle.labelId === label.index,
      );
      if (lAngle) {
        const [startX, startY] = controlPoint(
          store.radiuses.value.labelRadius,
          lAngle.arrowAngle - 1,
        );
        const [endX, endY] = controlPoint(
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
      const startAngle = store.angles.value.angles.find(
        (lAngle) => lAngle.labelId === label.index,
      )?.labelAngle;

      const endAngle = store.angles.value.angles.find(
        (lAngle) => lAngle.labelId === store.labelsZero.value[index + 1]?.index,
      )?.labelAngle;
      if (startAngle && endAngle) {
        arcBtwLabels.push({
          angle: startAngle - endAngle,
          rotation: -startAngle,
        });
      }
    }
  });
};
