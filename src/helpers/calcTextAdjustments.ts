import { Text } from "konva/lib/shapes/Text";

export const calcTextFontSize = (baseFontSize: number, text: string) => {
  const map = [1, 1, 0.85, 0.75, 0.5];
  const correction = map[text.length] ?? 0.3;
  return baseFontSize * correction;
};

export const calcCenteredOffset = (text: string, fontSize: number) => {
  const textNode = new Text({ text, fontSize });
  return { x: textNode.getWidth() / 2, y: textNode.getHeight() / 2 };
};

//for label.typeText
export const calcLeftShiftOffset = (
  text: string,
  fontSize: number,
  coeff: number,
) => {
  const actualFontSize = calcTextFontSize(fontSize, text);
  const textNode = new Text({ text, actualFontSize });
  return {
    x: (textNode.getWidth() + 6) * coeff,
    y: (textNode.getHeight() + 2) * coeff,
  };
};

//for label.numText
export const calcRightShiftOffset = (
  text: string,
  fontSize: number,
  coeff: number,
) => {
  const actualFontSize = calcTextFontSize(fontSize, text);
  const textNode = new Text({ text, actualFontSize });
  return {
    x: (textNode.getWidth() - 8) * coeff,
    y: (textNode.getHeight() - 7) * coeff,
  };
};
