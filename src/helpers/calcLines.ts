import type { Label, Line } from "../types";

export const calcLines = (
  labels: Label[],
  showLight: boolean,
  oneLevel: boolean,
) => {
  // расчёт нижнего уровня карты - набор элементов и связей
  const lines: Line[] = [];
  labels.map((label) => {
    if (label.connections.length !== 0) {
      label.connections.map((to) => {
        const labelTo = labels.find((elem) => elem.id == to);
        if (labelTo) {
          if (
            (showLight && labelTo.score < 0) ||
            (label.score < 0 && label.isBase == true) ||
            !showLight ||
            (oneLevel && label.drawAnyCase)
          ) {
            const labelIn = labels.find((x) => x.id === to);
            if (labelIn)
              lines.push({
                objLabelOut: label,
                objLabelIn: labelIn,
              });
          }
        }
      });
    }
  });
  return lines;
};
