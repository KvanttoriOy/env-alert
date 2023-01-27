import * as vscode from "vscode";
import { printDiffMessages } from "./print";
import { calculateDiff } from "./diff";

export const checkAll = async (verbose = false) => {
  if (!vscode.workspace.workspaceFolders) {
    return verbose && vscode.window.showWarningMessage("No workspaces open");
  }

  await Promise.allSettled(vscode.workspace.workspaceFolders.map(checkOne));
};

export const checkOne = async (ws: vscode.WorkspaceFolder) => {
  const example = vscode.Uri.joinPath(ws.uri, ".env.example");
  const env = vscode.Uri.joinPath(ws.uri, ".env");

  const diff = await calculateDiff(example, env);
  printDiffMessages(ws, diff);
};
