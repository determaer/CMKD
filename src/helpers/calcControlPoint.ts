export const calcControlPoint = (
  centerPoint: number,
  radius: number,
  angle: number,
): [number, number] => {
  const radians = (angle / 180) * Math.PI;
  const controlX = centerPoint + radius * Math.cos(radians);
  const controlY = centerPoint - radius * Math.sin(radians);
  return [+controlX.toFixed(2), +controlY.toFixed(2)];
};
