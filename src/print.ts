import * as vscode from "vscode";
import { Diff } from "./types";

/**
 * Prints the diff messages. Keys in
 */
export const printDiffMessages = (
  ws: vscode.WorkspaceFolder,
  diff: Diff | null
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
      `${ws.name}: Env files are in sync`
    );
  }

  // if there are fields that are only in the .env.example
  if (diff.a.length > 0) {
    vscode.window.showErrorMessage(
      `${
        ws.name
      } - The following keys are missing from your .env: ${diff.a.join(", ")}`
    );
  }

  if (diff.b.length > 0) {
    vscode.window.showWarningMessage(
      `${ws.name} - The following .env variables are unnecessary: ${diff.b.join(
        ","
      )}`
    );
  }
};
