import * as vscode from "vscode";
import simpleGit from "simple-git";

/**
 * Returns true if the given folder is ignored by .gitignore
 * in the current git project
 * @param path
 */
export const folderIsIgnored = async (dir: vscode.Uri) => {
  return new Promise((resolve, reject) => {
    simpleGit(dir.fsPath).checkIgnore(dir.fsPath, (err, data) =>
      err ? reject(err) : resolve(data.includes(dir.fsPath))
    );
  });
};
