export interface Label {
  id: number, // идентификатор
  index: number, // порядковый номер 
  prop: number, // принадлежность к группе
  typeText: string, // буквенное обозначение элемента
  numText: string, // цифровое обозначение элемента
  type: string, // фигурное обозначение элемента
  num: number, // количество представлений информации элементом
  score: number, // значение результата освоения элемента (-1; 1)
  isBase: boolean, // часть основной траектории
  connections: number[], // идентификаторы элементов, на которые опирается элемент
  competences?: number[], // (redo) дублирование connections с упором на компетенции
  secStart: boolean, // начало сектора
  secEnd: boolean, // конец сектора
  fontStyle: string, // тип начертания шрифта
  arrowOut: boolean, // исходящая стрелка образовательной траектории
  arrowIn: boolean, // входящая стрелка образовательной траектории
  level: number, // уровень на карте
  isLabel?: boolean, // сводная - наличие фигурного обозначения
  secLength?: number, // сводная - длина сектора
  lowLevel?: number[], // сводная - элементы иерархии, находящиеся выше
  highLevel?: number[], // сводная - элементы иерархии, находящиеся ниже
  object: any, // представление целевого объекта как есть
  position: number, // позиция...
  grey: boolean, // true = элемент не покрыт тестированием
  percent?: number, // представление score в процентном соотношении
  sectorName: string, // наименование сектора
  drawAnyCase: boolean, // ...
}