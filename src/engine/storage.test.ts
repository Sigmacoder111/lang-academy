import { describe, it, expect, beforeEach } from "vitest";
import type { UserProgress } from "../types/state";
import { makeDefaultNodeState } from "../types/state";
import { saveProgress, loadProgress, resetProgress, getSchemaVersion } from "./storage";

const makeState = (overrides: Partial<ReturnType<typeof makeDefaultNodeState>> = {}) =>
  makeDefaultNodeState(overrides);

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loadProgress returns empty object when nothing saved", () => {
    expect(loadProgress()).toEqual({});
  });

  it("saveProgress → loadProgress round-trips correctly", () => {
    const progress: UserProgress = {
      r1: makeState({ mastery: 0.6, interval: 300, totalReviews: 5, automaticity: 1.2 }),
    };
    saveProgress(progress);
    const loaded = loadProgress();
    expect(loaded.r1.mastery).toBe(0.6);
    expect(loaded.r1.automaticity).toBe(1.2);
  });

  it("resetProgress clears saved data", () => {
    saveProgress({ r1: makeState() });
    resetProgress();
    expect(loadProgress()).toEqual({});
  });

  it("loadProgress handles corrupt data gracefully", () => {
    localStorage.setItem("lang-academy-progress", "not-valid-json{{{");
    expect(loadProgress()).toEqual({});
  });

  it("sets schema version on save", () => {
    saveProgress({ r1: makeState() });
    expect(getSchemaVersion()).toBe(2);
  });

  it("migrates v1 data by adding default new fields", () => {
    const v1Data = {
      r1: {
        mastery: 0.7,
        interval: 3600,
        nextReview: Date.now() + 100000,
        totalReviews: 5,
        lastReviewedAt: Date.now(),
      },
    };
    localStorage.setItem("lang-academy-progress", JSON.stringify(v1Data));

    const loaded = loadProgress();
    expect(loaded.r1.mastery).toBe(0.7);
    expect(loaded.r1.automaticity).toBe(0);
    expect(loaded.r1.consecutiveCorrect).toBe(0);
    expect(loaded.r1.implicitReviewCredit).toBe(0);
    expect(getSchemaVersion()).toBe(2);
  });

  it("does not re-migrate v2 data", () => {
    const v2State = makeState({ mastery: 0.8, automaticity: 1.5 });
    saveProgress({ r1: v2State });

    const loaded = loadProgress();
    expect(loaded.r1.automaticity).toBe(1.5);
  });

  it("sets schema version to 2 on fresh load", () => {
    loadProgress();
    expect(getSchemaVersion()).toBe(2);
  });
});
