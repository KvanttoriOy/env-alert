import { parse } from "dotenv";
import * as vscode from "vscode";
import { compareKeys } from "./compare";
import { Diff } from "./types";

const exists = async (path: vscode.Uri): Promise<boolean> => {
  try {
    await vscode.workspace.fs.stat(path);
    return true;
  } catch (err) {
    return false;
  }
};

const parseFile = async (
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
  a: vscode.Uri,
  b: vscode.Uri
): Promise<Diff | null> => {
  const aData = await parseFile(a);
  const bData = await parseFile(b);

  if (!aData || !bData) {
    return null;
  }

  return compareKeys(aData, bData);
};
