import { useParamStore } from "../store/paramStore";

const store = useParamStore();

export const controlPoint = (
  radius: number,
  angle: number,
): [number, number] => {
  const radians = (angle / 180) * Math.PI;
  const controlX = store.centerPoint.value + radius * Math.cos(radians);
  const controlY = store.centerPoint.value - radius * Math.sin(radians);
  return [controlX, controlY];
};
