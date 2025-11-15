import type { Label, SelectableLabel } from "./label";
import type { Line } from "./line";
import type { Sector } from "./sector";

export interface Info {
  type: "supportLabel" | "sector" | "line" | "label";
  objLabel?: Label;
  prevLabels?: SelectableLabel[];
  nextLabels?: SelectableLabel[];
  object?: Label | Line | Sector;
}

