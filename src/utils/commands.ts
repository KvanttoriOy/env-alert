import * as vscode from "vscode";
import { printDiffMessages } from "./print";
import { calculateDiff, parseFile } from "./diff";
import { dirname, relative } from "path";
import { folderIsIgnored } from "./ignore";

export const checkAllWorkspaces = async () => {
  const folders = (await vscode.workspace.findFiles("**/.env*")).map((uri) =>
    uri.with({ path: dirname(uri.path) })
  );

  const uniqueFolders = new Set(folders.map((f) => f.path));

  await Promise.allSettled(
    [...uniqueFolders].map((path) => checkFolder(vscode.Uri.file(path)))
  );
};

export const checkFolder = async (uri: vscode.Uri) => {
  if (await folderIsIgnored(uri)) {
    console.log(`folder '${uri.fsPath}' is in .gitignore, skipping...`);
    return;
  }

  const ws = vscode.workspace.getWorkspaceFolder(uri);
  const rel = relative(ws?.uri.path!, uri.path);

  const wsName = (rel === "" ? ws?.name : `${ws?.name}/${rel}`) ?? uri.fsPath;

  const example = vscode.Uri.joinPath(uri, ".env.example");
  const env = vscode.Uri.joinPath(uri, ".env");
  const envLocal = vscode.Uri.joinPath(uri, ".env.local");
  const envDev = vscode.Uri.joinPath(uri, ".env.development");
  const envProd = vscode.Uri.joinPath(uri, ".env.production");

  const exampleData = await parseFile(example);
  const envData = await parseFile(env);
  const envLocalData = await parseFile(envLocal);
  const envDevData = await parseFile(envDev);
  const envProdData = await parseFile(envProd);

  if (!exampleData) {
    return vscode.window.showErrorMessage(
      `${wsName} - No .env.example file found`
    );
  }

  if (!envData && !envLocalData && !envDevData && !envProdData) {
    return vscode.window.showWarningMessage(`${wsName} - No .env file found`);
  }

  const filesToCheck = [
    [envData, ".env"],
    [envLocalData, ".env.local"],
    [envDevData, ".env.development"],
    [envProdData, ".env.production"],
  ] as const;

  for (const [data, fileName] of filesToCheck) {
    if (!data) {
      continue;
    }

    const diff = await calculateDiff(exampleData, data);
    printDiffMessages(wsName, diff, { a: ".env.example", b: fileName });
  }
};
