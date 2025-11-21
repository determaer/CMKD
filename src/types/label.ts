export interface Label {
  id: number; // идентификатор
  prop: number; // принадлежность к группе
  typeText: string; // буквенное обозначение элемента
  numText: string; // цифровое обозначение элемента
  type: "rect" | "roundrect" | "circle"; // фигурное обозначение элемента
  num: number; // количество представлений информации элементом
  score: number; // значение результата освоения элемента [-1; 1]
  isBase: boolean; // часть основной траектории
  connections: number[]; // идентификаторы элементов, на которые опирается элемент
  secStart: boolean; // начало сектора
  secEnd: boolean; // конец сектора
  fontStyle: string; // тип начертания шрифта
  arrowOut: boolean; // исходящая стрелка образовательной траектории
  arrowIn: boolean; // входящая стрелка образовательной траектории
  level: number; // уровень на карте
  grey: boolean; // true = элемент не покрыт тестированием
  yellow: boolean; //true = элемент ещё не был изучен
  sectorName: string; // наименование сектора
  isLabel?: boolean; // сводная - наличие фигурного обозначения
  secLength?: number; // сводная - длина сектора
}

export function instanceOfLabel(label: unknown): label is Label {
  return (
    label instanceof Object &&
    "id" in label &&
    "prop" in label &&
    "typeText" in label &&
    "numText" in label &&
    "type" in label &&
    "num" in label &&
    "score" in label &&
    "isBase" in label &&
    "connections" in label &&
    "secStart" in label &&
    "secEnd" in label &&
    "fontStyle" in label &&
    "arrowOut" in label &&
    "arrowIn" in label &&
    "level" in label &&
    "grey" in label &&
    "sectorName" in label
  );
}

export const defaultLabel: Label = {
  id: 0,
  prop: 0,
  typeText: "u",
  numText: "1",
  type: "circle",
  num: 1,
  score: 1,
  isBase: true,
  connections: [],
  secStart: true,
  secEnd: true,
  fontStyle: "normal",
  arrowOut: false,
  arrowIn: false,
  level: 0,
  isLabel: true,
  secLength: 1,
  grey: false,
  yellow: false,
  sectorName: "",
};

export type SelectableLabel = {
  label: Label;
  selected: boolean;
};
