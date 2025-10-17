import type { Label } from "./label"
import type { Line } from "./line"
import type { Sector } from "./sector"

export interface Info {
    type: 'supportLabel' | 'sector' | 'line' | 'label',
    objLabel?: Label,
    prevLabels?: Label[],
    nextLabels?: Label[],
    object?: Label | Line | Sector,
}