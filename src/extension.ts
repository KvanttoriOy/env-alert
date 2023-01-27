// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { checkAll, checkOne } from "./commands";

const onChangeWorkspaceFolders = (e: vscode.WorkspaceFoldersChangeEvent) => {
  e.added.forEach(checkOne);
};

const onFileChange = async (uri: vscode.Uri) => {
  const ws = vscode.workspace.getWorkspaceFolder(uri);
  if (ws) {
    await checkOne(ws);
  }
};

/**
 * Called after vs code is loaded.
 */
export function activate(context: vscode.ExtensionContext) {
  const checkAllDisposable = vscode.commands.registerCommand(
    "env-alert.checkAll",
    () => checkAll(true)
  );

  // check all workspaces when vs code opens
  checkAll(false);

  const watcher = vscode.workspace.createFileSystemWatcher("**/.env*");
  const watcherDisposable = watcher.onDidChange(onFileChange);

  const changeWSDisposable = vscode.workspace.onDidChangeWorkspaceFolders(
    onChangeWorkspaceFolders
  );

  context.subscriptions.push(
    checkAllDisposable,
    watcherDisposable,
    watcher,
    changeWSDisposable
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
