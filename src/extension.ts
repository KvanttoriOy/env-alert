// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { checkAllWorkspaces, checkWorkspace } from "./commands";

/**
 * Called after vs code is loaded.
 */
export function activate(context: vscode.ExtensionContext) {
  checkAllWorkspaces(false);

  const checkAllDisposable = vscode.commands.registerCommand(
    "env-alert.checkAll",
    () => checkAllWorkspaces(true)
  );

  const watcher = vscode.workspace.createFileSystemWatcher("**/.env*");
  const watcherDisposable = watcher.onDidChange(async (uri) => {
    const ws = vscode.workspace.getWorkspaceFolder(uri);
    if (ws) {
      await checkWorkspace(ws);
    }
  });

  const changeWSDisposable = vscode.workspace.onDidChangeWorkspaceFolders((e) =>
    e.added.forEach((ws) => checkWorkspace(ws))
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
