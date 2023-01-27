import * as vscode from "vscode";
import { Diff } from "./types";

/**
 * Prints the diff messages. Keys in
 */
export const printDiffMessages = (
  ws: vscode.WorkspaceFolder,
  diff: Diff | null,
  names: { a: string; b: string }
) => {
  if (!diff) {
    vscode.window.showInformationMessage(
      `${ws.name}: No .env or .env.example file found`
    );
    return null;
  }

  // no differences
  if (diff.a.length + diff.b.length === 0) {
    return vscode.window.showInformationMessage(
      `${ws.name} ${names.b} - In sync`
    );
  }

  // if there are fields that are only in the .env.example
  if (diff.a.length > 0) {
    vscode.window.showErrorMessage(
      `${ws.name} ${names.b} - The following keys are missing: ${diff.a.join(
        ", "
      )}`
    );
  }

  if (diff.b.length > 0) {
    vscode.window.showWarningMessage(
      `${ws.name} ${
        names.b
      } - The following variables are unnecessary: ${diff.b.join(",")}`
    );
  }
};
