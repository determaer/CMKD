export interface Sector {
  sStart: number, // начальный угол
  sEnd: number, // конечный угол
  sStartLID: number, // id элемента в начале сектора
  sEndLID: number, // id элемента в конце сектора
  sLevel: number, // уровень
  object: object, // объект, описываемый сектором
  shortname?: string, // наименование
}