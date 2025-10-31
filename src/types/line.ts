import type { Label } from "./label";
import { instanceOfLabel } from "./label";

export interface Line {
  objLabelIn: Label;
  objLabelOut: Label;
}

export function instanceOfLine(line: unknown): line is Line {
  return (
    line instanceof Object &&
    "objLabelIn" in line &&
    "objLabelOut" in line &&
    instanceOfLabel(line.objLabelIn) &&
    instanceOfLabel(line.objLabelOut)
  );
}
