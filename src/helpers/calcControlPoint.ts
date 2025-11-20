import type { ControlPoint } from "../types/control";

export const calcControlPoint = (
  centerPoint: number,
  radius: number,
  angle: number,
): ControlPoint => {
  const radians = (angle / 180) * Math.PI;
  const controlX = centerPoint + radius * Math.cos(radians);
  const controlY = centerPoint - radius * Math.sin(radians);
  return { x: +controlX.toFixed(2), y: +controlY.toFixed(2) };
};
