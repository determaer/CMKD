import { expect, it, describe, expectTypeOf } from "vitest";
import { calcSectors } from "../src/helpers/calcSectors";
import { calcAngles } from "../src/helpers/calcAngles";
import { oneLevelCMKD1 } from "../src/stories/cmkd-sets/oneLevelStandardCMKD1";
import { summaryCMKD } from "../src/stories/cmkd-sets/summaryCMKD";

describe("calc sectors for one level cmkd", () => {
  const discNum = oneLevelCMKD1.length;
  it("there are 36 label", () => {
    expect(discNum).toBe(36);
  });
  const circleNum = oneLevelCMKD1.reduce(
    (acc, current) => (acc = current.level > acc ? current.level : acc),
    0,
  );
  it("there are labels with only level = 0", () => {
    expect(circleNum).toBe(0);
  });
  const angles = calcAngles(oneLevelCMKD1, 1);
  it("there are 36 angles for labels", () => {
    expect(angles).toHaveLength(36);
  });
  const sectors = calcSectors(discNum, angles, oneLevelCMKD1);
  it("there are 8 sectors for labels", () => {
    expect(sectors).toHaveLength(8);
  });
  it("every sector with sLevel = 0", () => {
    for (const sector of sectors) {
      expect(sector.sLevel).toBe(0);
    }
  });
  it("all angles in range [0; 360)", () => {
    for (const sector of sectors) {
      expect(sector.sStart).toBeLessThan(360);
      expect(sector.sEnd).toBeLessThan(360);
      expect(sector.sStart).toBeGreaterThanOrEqual(0);
      expect(sector.sEnd).toBeGreaterThanOrEqual(0);
    }
  });
  it("sectors with right length (depends on labels count in sector)", () => {
    const lengths = [40, 40, 40, 60, 40, 100, 30, 9.9999];
    for (let i = 0; i < 8; i++) {
      expect(sectors[i].sEnd - sectors[i].sStart).toBeCloseTo(lengths[i], 5);
    }
  });
});

describe("calc sectors for 3 level cmkd", () => {
  it("there are 54 label", () => {
    expect(summaryCMKD.length).toBe(54);
  });
  const circleNum = summaryCMKD.reduce(
    (acc, current) => (acc = current.level > acc ? current.level : acc),
    0,
  );
  it("max level of labels = 2", () => {
    expect(circleNum).toBe(2);
  });
  const labelsZero = summaryCMKD.filter((label) => label.level == 0);
  const discNum = labelsZero.length;
  it("there are 36 label with level = 0", () => {
    expect(discNum).toBe(36);
  });
  const angles = calcAngles(labelsZero, 1);
  it("there are 36 angles for labels = 0", () => {
    expect(angles).toHaveLength(36);
  });
  const sectors = calcSectors(discNum, angles, summaryCMKD);
  it("there are 26 sectors for labels", () => {
    expect(sectors).toHaveLength(26);
  });
  it("every sector with sLevel in range [0;2]", () => {
    for (const sector of sectors) {
      expect(sector.sLevel).toBeLessThanOrEqual(2);
      expect(sector.sLevel).toBeGreaterThanOrEqual(0);
    }
  });
  it("all angles in range [0; 360)", () => {
    for (const sector of sectors) {
      expect(sector.sStart).toBeLessThan(360);
      expect(sector.sEnd).toBeLessThan(360);
      expect(sector.sStart).toBeGreaterThanOrEqual(0);
      expect(sector.sEnd).toBeGreaterThanOrEqual(0);
    }
  });

  it("sectors sLevel = 2 with right length", () => {
    const lengths = [50, 80, 70, 60, 60, 39.9999];
    for (let i = 0; i < 6; i++) {
      expect(sectors[i].sLevel).toBe(2);
      expect(sectors[i].sEnd - sectors[i].sStart).toBeCloseTo(lengths[i]);
    }
  });

  it("sectors sLevel = 1 with right length", () => {
    const lengths = [30, 20, 40, 40, 50, 20, 40, 20, 20, 20, 20, 39.9999];
    const sectors1level = sectors.filter((sector) => sector.sLevel == 1);
    for (let i = 0; i < 12; i++) {
      expect(sectors1level[i].sLevel).toBe(1);
      expect(sectors1level[i].sEnd - sectors1level[i].sStart).toBeCloseTo(
        lengths[i],
      );
    }
  });

  it("sectors sLevel = 0 with right length", () => {
    const lengths = [40, 40, 40, 60, 40, 100, 30, 9.9999];
    const sectors0level = sectors.filter((sector) => sector.sLevel == 0);
    for (let i = 0; i < 8; i++) {
      expect(sectors0level[i].sEnd - sectors0level[i].sStart).toBeCloseTo(
        lengths[i],
        5,
      );
    }
  });
});
