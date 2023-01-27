import { parse } from "dotenv";
import * as vscode from "vscode";
import { Diff } from "./types";

const exists = async (path: vscode.Uri): Promise<boolean> => {
  try {
    await vscode.workspace.fs.stat(path);
    return true;
  } catch (err) {
    return false;
  }
};

export const parseFile = async (
  path: vscode.Uri
): Promise<Record<string, string> | null> => {
  if (!(await exists(path))) {
    return null;
  }

  const data = await vscode.workspace.fs.readFile(path);
  return parse(data.toString());
};

/**
 * Loads the files `a` and `b`, and returns the difference in keys between them.
 */
export const calculateDiff = async (
  a: Record<string, string> | null,
  b: Record<string, string> | null
): Promise<Diff | null> => {
  if (!a || !b) {
    return null;
  }

  const aOnly = Object.keys(a).filter(
    (key) => !Object.prototype.hasOwnProperty.call(b, key)
  );

  const bOnly = Object.keys(b).filter(
    (key) => !Object.prototype.hasOwnProperty.call(a, key)
  );

  const both = Object.keys(b).filter((key) =>
    Object.prototype.hasOwnProperty.call(a, key)
  );

  return {
    a: aOnly,
    b: bOnly,
    both: both,
  };
};
