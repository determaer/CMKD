import { useParamStore } from "../store/paramStore"

const store = useParamStore()

export const controlPoint = (radius: number, angle: number): [number, number] => {
  var radians = (angle / 180) * Math.PI
  var controlX = store.x.value + radius * Math.cos(radians)
  var controlY = store.y.value - radius * Math.sin(radians)
  return [controlX, controlY]
}