import type { Label, Line } from "../types";

export const calcLines = (
  labels: Label[],
  showLight: boolean,
  showAdditionalInCircle: boolean,
) => {
  const lines: Line[] = [];

  labels.forEach((label) => {
    const connectedLabels = labels.filter((toLabel) =>
      label.connections.some((connection) => toLabel.id == connection),
    );
    connectedLabels.forEach((toLabel) => {
      const isTargetLabelShowing = showAdditionalInCircle || label.isBase;
      const isConnectedLabelShowing = showAdditionalInCircle || toLabel.isBase;
      const isLineImportant = toLabel.score < 0 || label.score < 0;
      if (
        (showLight && isLineImportant && toLabel.isBase && label.isBase) ||
        (!showLight && isTargetLabelShowing && isConnectedLabelShowing)
      ) {
        lines.push({
          objLabelOut: label,
          objLabelIn: toLabel,
        });
      }
    });
  });

  return lines;
};
