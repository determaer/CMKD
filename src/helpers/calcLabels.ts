import { Label } from "../types/label"

export const calcLabels = (store) => {
  // расчёт нижнего уровня карты - набор элементов и связей
  let t = 0
  let tLevel = 0
  let labelsZeroLevel : Label[] = []
  for (let i = 0; i < store.labels.length; i = i + 1) {
    if (store.labels[i].level > tLevel) 
      tLevel = store.labels[i].level
    if (store.labels[i].level == 0) {
       t = t + 1
       labelsZeroLevel.push(store.labels[i])
    }
  }
  store.circleNum = tLevel
  store.oneLevel = store.circleNum == 0
  if (store.oneLevel) store.showSectorName = true
  store.discNum = t
  store.labelsZero = labelsZeroLevel

  store.labelsZero.map((label, from) => {
    if (label.connections.length !== 0) {
      label.connections.map((to) => {
        const labelTo = store.labels.find((elem) => elem.id == to)
        if (labelTo){
          if ((store.showLight &&  labelTo.score < 0) ||
            (label.score < 0 && label.isBase == true) || !store.showLight ||
            (store.oneLevel && label.drawAnyCase)){
              const labelIn = store.labelsZero.find((x) => x.id === to)
              if (labelIn)
              store.lines.push({
                objLabelOut: store.labelsZero[from],
                objLabelIn: labelIn,
              })
          }
        }
      })
    }
  })
}