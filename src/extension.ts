import { dirname } from "path";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { checkAllWorkspaces, checkFolder } from "./utils/commands";

/**
 * Called after vs code is loaded.
 */
export function activate(context: vscode.ExtensionContext) {
  checkAllWorkspaces();

  const checkAllDisposable = vscode.commands.registerCommand(
    "env-alert.checkAll",
    () => checkAllWorkspaces()
  );

  const watcher = vscode.workspace.createFileSystemWatcher("**/.env*");

  const watcherDisposable = watcher.onDidChange(async (uri) => {
    const folder = uri.with({ path: dirname(uri.path) });
    await checkFolder(folder);
  });

  const changeWSDisposable = vscode.workspace.onDidChangeWorkspaceFolders((e) =>
    e.added.forEach((ws) => checkFolder(ws.uri))
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
