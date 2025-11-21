import { expect, it, describe } from "vitest";
import { calcAngles } from "../src/helpers/calcAngles";
import type { Angle } from "../src/types/angle";

describe("calc 3 angles on the 360 deg circle with correction = 1", () => {
  const labels: any = [];
  for (let i = 0; i < 3; i++) labels.push({ id: i });

  it("result is array with length 3", () => {
    expect(calcAngles(labels, 1)).toHaveLength(3);
  });
  it("result is equal to snapshot", () => {
    expect(calcAngles(labels, 1)).toMatchSnapshot();
  });
  it("difference between every label is 120 deg", () => {
    const angles = calcAngles(labels, 1);
    for (let i = 0; i < 2; i++) {
      expect(angles[i].labelAngle).toBe(angles[i + 1].labelAngle - 120);
    }
  });
});

describe("calc 18 angles on the 360 deg circle with correction = 1", () => {
  const angle = {
    labelId: 16,
    inAngle: 422,
    outAngle: 418,
    labelAngle: 420,
    arrowAngle: 416,
  };
  const labels: any = [];
  for (let i = 0; i < 18; i++) labels.push({ id: i });
  it("result is array with length 18", () => {
    expect(calcAngles(labels, 1)).toHaveLength(18);
  });
  it("have an angle at index 16 with labelangle = 420", () => {
    expect(calcAngles(labels, 1)).toContainEqual<Angle>(angle);
  });
  it("result is equal to snapshot", () => {
    expect(calcAngles(labels, 1)).toMatchSnapshot();
  });
  it("difference between every label is 20 deg", () => {
    const angles = calcAngles(labels, 1);
    for (let i = 0; i < 17; i++) {
      expect(angles[i].labelAngle).toBe(angles[i + 1].labelAngle - 20);
    }
  });
});

describe("calc 9 angles on the 360 deg circle with correction = 1", () => {
  const labels: any = [];
  for (let i = 0; i < 9; i++) labels.push({ id: i });
  it("result is array with length 9", () => {
    expect(calcAngles(labels, 1)).toHaveLength(9);
  });
  it("result is equal to snapshot", () => {
    expect(calcAngles(labels, 1)).toMatchSnapshot();
  });
  it("difference between every label is 40 deg", () => {
    const angles = calcAngles(labels, 1);
    for (let i = 0; i < 8; i++) {
      expect(angles[i].labelAngle).toBe(angles[i + 1].labelAngle - 40);
    }
  });
});

describe("calc 36 angles on the 360 deg circle with correction = 1", () => {
  const labels: any = [];
  for (let i = 0; i < 36; i++) labels.push({ id: i });
  it("result is array with length 36", () => {
    expect(calcAngles(labels, 1)).toHaveLength(36);
  });
  it("result is equal to snapshot", () => {
    expect(calcAngles(labels, 1)).toMatchSnapshot();
  });
  it("difference between every label is 10 deg", () => {
    const angles = calcAngles(labels, 1);
    for (let i = 0; i < 35; i++) {
      expect(angles[i].labelAngle).toBe(angles[i + 1].labelAngle - 10);
    }
  });
});
