import { calcLabels } from "./calcLabels";
import { calcAngles } from "./calcAngles";
import { calcSectors } from "./calcSectors";

export const calcCMKD = (skipLabels?: boolean) => {
  if (!skipLabels) calcLabels();
  calcAngles();
  calcSectors();
};

