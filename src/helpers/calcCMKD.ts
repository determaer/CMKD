import { calcLabels } from "./calcLabels";
import { calcParams } from "./calcParams";
import { calcSectors } from "./calcSectors";

export const calcCMKD = (skipLabels?: boolean) => {
  if (!skipLabels) calcLabels();
  calcParams();
  calcSectors();
};
