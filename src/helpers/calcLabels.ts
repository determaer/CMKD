import type { Label } from "../types/label"
import { useParamStore } from "../store/paramStore"

const store = useParamStore()

export const calcLabels = () => {
  // расчёт нижнего уровня карты - набор элементов и связей
  let t = 0
  let tLevel = 0
  const labelsZeroLevel : Label[] = []
  store.labels.value.forEach((label) => {
    if (label.level > tLevel) 
      tLevel = label.level
    if (label.level == 0) {
      t = t + 1
      labelsZeroLevel.push(label)
    }
  })

  store.circleNum.value = tLevel
  store.oneLevel.value = store.circleNum.value == 0
  if (store.oneLevel.value) store.showSectorName.value = true
  store.discNum.value = t
  store.labelsZero.value = labelsZeroLevel

  store.labelsZero.value.map((label) => {
    if (label.connections.length !== 0) {
      label.connections.map((to) => {
        const labelTo = store.labels.value.find((elem) => elem.id == to)
        if (labelTo){
          if ((store.showLight &&  labelTo.score < 0) ||
            (label.score < 0 && label.isBase == true) || !store.showLight ||
            (store.oneLevel && label.drawAnyCase)){
              const labelIn = store.labelsZero.value.find((x) => x.id === to)
              if (labelIn)
              store.lines.value.push({
                objLabelOut: label,
                objLabelIn: labelIn,
              })
          }
        }
      })
    }
  })
}