import { useParamStore } from "../store/paramStore"

const store = useParamStore()

export const calcParams = () => {
  // расчёт опорных углов и окружностей
  const arrLabelAngles: number[] = [],
  arrInAngles: number[] = [],
  arrOutAngles: number[] = [],
  arrArrowsAngles: number[] = [],
  arrDividerAngles: number[] = [],
  arrAngles: object[] = []
  for (let i = 1; i <= store.discNum.value * 2; i = i + 2) {
    arrLabelAngles.push(i * (360 / (store.discNum.value * 2)) + 90)
  }
  for (let i = 1; i < store.pointNum.value; i = i + store.circleDivider) {
    let tIn = (i + 1) * (360 / store.pointNum.value) + 90 
    let tOut = (i + 2) * (360 / store.pointNum.value) + 90
    let tArrow = tIn - 2 * store.sizeMultiplier.value
    arrArrowsAngles.push(tArrow)
    arrInAngles.push(tOut)
    arrOutAngles.push(tIn)
  }
  for (let i = 0; i < store.discNum.value; i = i + 1) {
    arrAngles.push({
      labelId: store.labelsZero.value[i].index,
      inAngle: arrInAngles[i],
      outAngle: arrOutAngles[i],
      labelAngle: arrLabelAngles[i],
      arrowAngle: arrArrowsAngles[i],
    })
  }

  arrDividerAngles.push(90)
  for (let i = 0; i < store.discNum.value - 1; i = i + 1) {
    if (store.labelsZero.value[i].prop !== store.labelsZero.value[i + 1].prop) {
      arrDividerAngles.push(
        arrLabelAngles[i] + (arrLabelAngles[i + 1] - arrLabelAngles[i]) / 2
      )
    }
  }

  const add = store.discNum.value < 50 ? 0 : 50
  store.params.value = ({
    outerRadius: (250 + add) * store.scaleMultiplier.value,
    innerRadius: (200 + add) * store.scaleMultiplier.value,
    labelRadius: (225 + add) * store.scaleMultiplier.value,
    additionalLabelRadius: (285 + add) * store.scaleMultiplier.value,
    linesBtwElementsRadius: (190 + add) * store.scaleMultiplier.value,
    mergingPortsRadius: (212 + add) * store.scaleMultiplier.value,
    sectorNameRadius: (265 + add) * store.scaleMultiplier.value,
    dividerAngles: arrDividerAngles,
    angles: arrAngles,
  })
  // расчёт секторов
  for (let i = store.circleNum.value; i >= 0; i = i - 1) {
    const sectorsAngles : number[] = []
    const sectorsLabels : any[] = []
    let currentAngle = 0
    sectorsAngles.push(0)

    if (store.params.value.angles.length > 0) {
      if (i == 0) { // классическая карта или нижний уровень сводной карты
        let start, end1
        if (store.params.value.angles.length > 0) {
          store.labelsZero.value.map((label) => {
            if (label.secStart) start = label.index
            if (label.secEnd) {
              let end = label.index
              if (end != store.labels.value.length - 1) {
                let angle1 = store.params.value.angles.find((lAngle) => lAngle.labelId === end + 1)?.labelAngle
                let angle2 = store.params.value.angles.find((lAngle) => lAngle.labelId === end)?.labelAngle
                let angle = angle2 + (angle1 - angle2) / 2
                sectorsAngles.push(angle - 90)
              }

              end1 = label.index
              sectorsLabels.push({
                sStartLID: start,
                sEndLID: end1,
                upperID: label.object?.parent_id,
                sLevel: 0,
                shortname: label.sectorName,
                object: label,
              })
              start = null
            }
          })
        }
        sectorsAngles.push(360)
      } 
      else { // верхние уровни сводной карты
        store.labels.value.map((label) => {
          if (label.level == i && label.secLength) {
            const nextAngle = currentAngle + 360 * (label.secLength / store.discNum.value)
            sectorsAngles.push(nextAngle)
            currentAngle = nextAngle
            sectorsLabels.push({
              sStartLID: label.index,
              sEndLID: label.index,
              sLevel: i,
              object: label,
              upperID: label.object.parent_id,
            })
          }
        })
      }
    }

    if (sectorsLabels.length > 0){
      for (let i = 0; i < sectorsAngles.length - 1; i = i + 1) {
        store.sectors.value.push({
          sStart: sectorsAngles[i],
          sEnd: sectorsAngles[i + 1],
          sStartLID: sectorsLabels[i].sStartLID,
          sEndLID: sectorsLabels[i].sEndLID,
          sLevel: sectorsLabels[i].sLevel,
          object: sectorsLabels[i]?.objLabel,
          shortname: sectorsLabels[i].shortname ? sectorsLabels[i].shortname : null,
        })
      }
    }
  }
}