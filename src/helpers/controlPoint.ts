import { useParamStore } from "../store/paramStore";

const store = useParamStore();

export const controlPoint = (
  radius: number,
  angle: number,
): [number, number] => {
  const radians = (angle / 180) * Math.PI;
  const controlX = store.x.value + radius * Math.cos(radians);
  const controlY = store.y.value - radius * Math.sin(radians);
  return [controlX, controlY];
};
