import { expect, test } from "vitest";
import { calcControlPoint } from "../src/helpers/calcControlPoint";

test("calc coordinates {X; Y} for angle 0, radius 200 and center {400; 400}", () => {
  expect(calcControlPoint(400, 200, 0)).toStrictEqual([600, 400]);
});

test("calc coordinates {X; Y} for angle 45, radius 200 and center {400; 400}", () => {
  expect(calcControlPoint(400, 200, 45)).toStrictEqual([541.42, 258.58]);
});

test("calc coordinates {X; Y} for angle 90, radius 200 and center {400; 400}", () => {
  expect(calcControlPoint(400, 200, 90)).toStrictEqual([400, 200]);
});

test("calc coordinates {X; Y} for angle 0, radius 0 and center {0; 0}", () => {
  expect(calcControlPoint(0, 0, 0)).toStrictEqual([0, 0]);
});

test("calc coordinates {X; Y} for angle 0, radius -200 and center {0; 0}", () => {
  expect(calcControlPoint(0, -200, 0)).toStrictEqual([-200, 0]);
});

test("calc coordinates {X; Y} for angle 0, radius -600 and center {-400; -400}", () => {
  expect(calcControlPoint(-400, -600, 0)).toStrictEqual([-1000, -400]);
});

test("calc coordinates {X; Y} for angle 720, radius -600 and center {-400; -400}", () => {
  expect(calcControlPoint(-400, -600, 720)).toStrictEqual([-1000, -400]);
});

test("calc coordinates {X; Y} for angle -720, radius -600 and center {-400; -400}", () => {
  expect(calcControlPoint(-400, -600, -720)).toStrictEqual([-1000, -400]);
});
