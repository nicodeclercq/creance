import { describe, expect, it } from "vitest";

import { getMergeDiffs } from "./synchronize";

const lastUpdateDate = new Date("2000-01-10");

describe("getMergeDiffs", () => {
  describe("created", () => {
    it("should add to remote new local items", () => {
      const local = {
        local1: { updatedAt: new Date("2000-01-11") },
      };
      const remote = {};
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.local.unchanged)).toEqual(["local1"]);
      expect(Object.keys(diffs.remote.created)).toEqual(["local1"]);
    });
    it("should add to local new remote items", () => {
      const local = {};
      const remote = {
        remote1: { updatedAt: new Date("2000-01-11") },
      };
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.local.created)).toEqual(["remote1"]);
      expect(Object.keys(diffs.remote.unchanged)).toEqual(["remote1"]);
    });
  });
  describe("unchanged", () => {
    it("should do nothing on unchanged items", () => {
      const date = new Date("2000-01-05");

      const local = {
        shared1: { updatedAt: date },
      };
      const remote = {
        shared1: { updatedAt: date },
      };
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.local.unchanged)).toEqual(["shared1"]);
      expect(Object.keys(diffs.remote.unchanged)).toEqual(["shared1"]);
    });
  });
  describe("updated", () => {
    it("should update on remote changed local items", () => {
      const local = {
        shared1: { updatedAt: new Date("2000-01-11") },
      };
      const remote = {
        shared1: { updatedAt: new Date("2000-01-05") },
      };
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.remote.updated)).toEqual(["shared1"]);
      expect(Object.keys(diffs.local.unchanged)).toEqual(["shared1"]);
    });
    it("should update on local changed remote items", () => {
      const local = {
        shared1: { updatedAt: new Date("2000-01-05") },
      };
      const remote = {
        shared1: { updatedAt: new Date("2000-01-11") },
      };
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.local.updated)).toEqual(["shared1"]);
      expect(Object.keys(diffs.remote.unchanged)).toEqual(["shared1"]);
    });
  });
  describe("deleted", () => {
    it("should remove from local unknwon remote items", () => {
      const local = {
        local1: { updatedAt: new Date("2000-01-05") },
      };
      const remote = {};
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.local.deleted)).toEqual(["local1"]);
    });
    it("should remove from remote unknwon local items", () => {
      const local = {};
      const remote = {
        remote1: { updatedAt: new Date("2000-01-05") },
      };
      const diffs = getMergeDiffs({
        local,
        remote,
        lastUpdateDate,
      });

      expect(Object.keys(diffs.remote.deleted)).toEqual(["remote1"]);
    });
  });
});
