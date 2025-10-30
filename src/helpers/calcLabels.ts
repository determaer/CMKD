import { useParamStore } from "../store/paramStore";

const store = useParamStore();

export const calcLabels = () => {
  // расчёт нижнего уровня карты - набор элементов и связей
  let tLevel = 0;

  const labelsZeroLevel = store.labels.value.filter((label) => {
    if (label.level > tLevel) tLevel = label.level;
    if (label.level == 0) {
      return label;
    }
  });

  store.circleNum.value = tLevel;
  store.oneLevel.value = store.circleNum.value == 0;
  store.discNum.value = labelsZeroLevel.length;
  store.labelsZero.value = labelsZeroLevel;

  store.labelsZero.value.map((label) => {
    if (label.connections.length !== 0) {
      label.connections.map((to) => {
        const labelTo = store.labels.value.find((elem) => elem.id == to);
        if (labelTo) {
          if (
            (store.showLight.value && labelTo.score < 0) ||
            (label.score < 0 && label.isBase == true) ||
            !store.showLight.value ||
            (store.oneLevel.value && label.drawAnyCase)
          ) {
            const labelIn = store.labelsZero.value.find((x) => x.id === to);
            if (labelIn)
              store.lines.value.push({
                objLabelOut: label,
                objLabelIn: labelIn,
              });
          }
        }
      });
    }
  });
};
