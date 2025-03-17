export const calcParams = (store) => {
  // расчёт опорных углов и окружностей
  const arrLabelAngles: number[] = [],
  arrInAngles: number[] = [],
  arrOutAngles: number[] = [],
  arrArrowsAngles: number[] = [],
  arrDividerAngles: number[] = [],
  arrAngles: object[] = []
  for (let i = 1; i <= store.discNum * 2; i = i + 2) {
    arrLabelAngles.push(i * (360 / (store.discNum * 2)) + 90)
  }
  for (let i = 1; i < store.pointNum; i = i + store.circleDivider) {
    let tIn = (i + 1) * (360 / store.pointNum) + 90 
    let tOut = (i + 2) * (360 / store.pointNum) + 90
    let tArrow = tIn - 2 * store.sizeMultiplier
    arrArrowsAngles.push(tArrow)
    arrInAngles.push(tOut)
    arrOutAngles.push(tIn)
  }
  for (let i = 0; i < store.discNum; i = i + 1) {
    arrAngles.push({
      labelId: store.labelsZero[i].index,
      inAngle: arrInAngles[i],
      outAngle: arrOutAngles[i],
      labelAngle: arrLabelAngles[i],
      arrowAngle: arrArrowsAngles[i],
    })
  }

  arrDividerAngles.push(90)
  for (let i = 0; i < store.discNum - 1; i = i + 1) {
    if (store.labelsZero[i].prop !== store.labelsZero[i + 1].prop) {
      arrDividerAngles.push(
        arrLabelAngles[i] + (arrLabelAngles[i + 1] - arrLabelAngles[i]) / 2
      )
    }
  }

  const add = store.discNum < 50 ? 0 : 50
  store.params = ({
    outerRadius: (250 + add) * store.scaleMultiplier,
    innerRadius: (200 + add) * store.scaleMultiplier,
    labelRadius: (225 + add) * store.scaleMultiplier,
    additionalLabelRadius: (285 + add) * store.scaleMultiplier,
    linesBtwElementsRadius: (190 + add) * store.scaleMultiplier,
    mergingPortsRadius: (212 + add) * store.scaleMultiplier,
    sectorNameRadius: (265 + add) * store.scaleMultiplier,
    dividerAngles: arrDividerAngles,
    angles: arrAngles,
  })
  // расчёт секторов
  for (let i = store.circleNum; i >= 0; i = i - 1) {
    const sectorsAngles : number[] = []
    const sectorsLabels : any[] = []
    let currentAngle = 0
    sectorsAngles.push(0)

    if (store.params.angles.length > 0) {
      if (i == 0) { // классическая карта или нижний уровень сводной карты
        let start, end1
        if (store.params.angles.length > 0) {
          store.labelsZero.map((label) => {
            if (label.secStart) start = label.index
            if (label.secEnd) {
              let end = label.index
              if (end != store.labels.length - 1) {
                let angle1 = store.params.angles.find((lAngle) => lAngle.labelId === end + 1)?.labelAngle
                let angle2 = store.params.angles.find((lAngle) => lAngle.labelId === end)?.labelAngle
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
        store.labels.map((label) => {
          if (label.level == i && label.secLength) {
            const nextAngle = currentAngle + 360 * (label.secLength / store.discNum)
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
        store.sectors.push({
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