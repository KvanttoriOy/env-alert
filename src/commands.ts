import * as vscode from "vscode";
import { printDiffMessages } from "./print";
import { calculateDiff, parseFile } from "./diff";

export const checkAll = async (verbose = false) => {
  if (!vscode.workspace.workspaceFolders) {
    return verbose && vscode.window.showWarningMessage("No workspaces open");
  }

  await Promise.allSettled(vscode.workspace.workspaceFolders.map(checkOne));
};

export const checkOne = async (ws: vscode.WorkspaceFolder) => {
  const example = vscode.Uri.joinPath(ws.uri, ".env.example");
  const env = vscode.Uri.joinPath(ws.uri, ".env");
  const envLocal = vscode.Uri.joinPath(ws.uri, ".env.local");
  const envDev = vscode.Uri.joinPath(ws.uri, ".env.development");
  const envProd = vscode.Uri.joinPath(ws.uri, ".env.production");

  const exampleData = await parseFile(example);
  const envData = await parseFile(env);
  const envLocalData = await parseFile(envLocal);
  const envDevData = await parseFile(envDev);
  const envProdData = await parseFile(envProd);

  if (!exampleData) {
    return vscode.window.showWarningMessage(
      `${ws.name} - No .env.example file found`
    );
  }

  if (!envData && !envLocalData && !envDevData && !envProdData) {
    return vscode.window.showWarningMessage(`${ws.name} - No .env file found`);
  }

  if (envData) {
    const diff = await calculateDiff(exampleData, envData);
    printDiffMessages(ws, diff, { a: ".env.example", b: ".env" });
  }

  if (envLocalData) {
    const diff = await calculateDiff(exampleData, envLocalData);
    printDiffMessages(ws, diff, { a: ".env.example", b: ".env.local" });
  }

  if (envDevData) {
    const diff = await calculateDiff(exampleData, envDevData);
    printDiffMessages(ws, diff, { a: ".env.example", b: ".env.development" });
  }

  if (envProdData) {
    const diff = await calculateDiff(exampleData, envProdData);
    printDiffMessages(ws, diff, { a: ".env.example", b: ".env.production" });
  }
};
