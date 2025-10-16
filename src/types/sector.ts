export interface Sector extends SectorLabel {
  sStart: number, // начальный угол
  sEnd: number, // конечный угол
}

export interface SectorLabel {
  sStartLID: number, // id элемента в начале сектора
  sEndLID: number, // id элемента в конце сектора
  sLevel: number, // уровень
  object: object, // объект, описываемый сектором
  shortname?: string, // наименование
}