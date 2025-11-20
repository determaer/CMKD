import { expect, describe, it } from "vitest";
import { calcControlPoint } from "../src/helpers/calcControlPoint";

describe("calc coordinates {X; Y} for various data", () => {
  it("angle 0, radius 200 and center {400; 400}", () => {
    expect(calcControlPoint(400, 200, 0)).toStrictEqual({ x: 600, y: 400 });
  });

  it("angle 45, radius 200 and center {400; 400}", () => {
    expect(calcControlPoint(400, 200, 45)).toStrictEqual({
      x: 541.42,
      y: 258.58,
    });
  });

  it("angle 90, radius 200 and center {400; 400}", () => {
    expect(calcControlPoint(400, 200, 90)).toStrictEqual({ x: 400, y: 200 });
  });

  it("angle 0, radius 0 and center {0; 0}", () => {
    expect(calcControlPoint(0, 0, 0)).toStrictEqual({ x: 0, y: 0 });
  });

  it("angle 0, radius -200 and center {0; 0}", () => {
    expect(calcControlPoint(0, -200, 0)).toStrictEqual({ x: -200, y: 0 });
  });

  it("angle 0, radius -600 and center {-400; -400}", () => {
    expect(calcControlPoint(-400, -600, 0)).toStrictEqual({
      x: -1000,
      y: -400,
    });
  });

  it("angle 720, radius -600 and center {-400; -400}", () => {
    expect(calcControlPoint(-400, -600, 720)).toStrictEqual({
      x: -1000,
      y: -400,
    });
  });

  it("angle -720, radius -600 and center {-400; -400}", () => {
    expect(calcControlPoint(-400, -600, -720)).toStrictEqual({
      x: -1000,
      y: -400,
    });
  });
});
