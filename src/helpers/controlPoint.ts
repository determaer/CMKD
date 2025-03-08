export const controlPoint = (x: number, y: number, radius: number, angle: number) => {
  var radians = (angle / 180) * Math.PI
  var controlX = x + radius * Math.cos(radians)
  var controlY = y - radius * Math.sin(radians)
  return [controlX, controlY]
}