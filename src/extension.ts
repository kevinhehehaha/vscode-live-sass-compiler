"use strict";

import * as vscode from "vscode";

import { AppModel } from "./appModel";
import { checkNewAnnouncement } from "./announcement/index";
import { OutputWindow } from "./VsCode/OutputWindow";
import { ErrorLogger } from "./VsCode/ErrorLogger";
import { OutputLevel } from "./Enums/OutputLevel";
import { SettingsHelper } from "./Helpers/SettingsHelper";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    try {
        OutputWindow.Show(OutputLevel.Trace, '"live-sass-compiler" is now activate');

        const appModel = new AppModel(context.workspaceState);

        checkNewAnnouncement(context.globalState);

        const disposableStartWatching = vscode.commands.registerCommand(
            "liveSass.command.watchMySass",
            async () => {
                OutputWindow.Show(
                    OutputLevel.Trace,
                    'Command called: "liveSass.command.watchMySass"'
                );

                await appModel.StartWatching();
            }
        ),
            disposableStopWaching = vscode.commands.registerCommand(
                "liveSass.command.donotWatchMySass",
                () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.donotWatchMySass"'
                    );

                    appModel.StopWatching();
                }
            ),
            disposableOneTimeCompileSass = vscode.commands.registerCommand(
                "liveSass.command.oneTimeCompileSass",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.oneTimeCompileSass"'
                    );

                    await appModel.compileAllFiles();
                }
            ),
            disposableCompileCurrentSass = vscode.commands.registerCommand(
                "liveSass.command.compileCurrentSass",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.compileCurrentSass"'
                    );

                    await appModel.compileCurrentFile();
                }
            ),
            disposableOpenOutputWindow = vscode.commands.registerCommand(
                "liveSass.command.openOutputWindow",
                () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.openOutputWindow"'
                    );

                    appModel.openOutputWindow();
                }
            ),
            disposableCreateIssue = vscode.commands.registerCommand(
                "liveSass.command.createIssue",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.createIssue"'
                    );

                    await appModel.createIssue();
                }
            ),
            disposableDebugInclusion = vscode.commands.registerCommand(
                "liveSass.command.debugInclusion",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.debugInclusion"'
                    );

                    await appModel.debugInclusion();
                }
            ),
            disposableDebugFileList = vscode.commands.registerCommand(
                "liveSass.command.debugFileList",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.debugFileList"'
                    );

                    await appModel.debugFileList();
                }
            ),
            disposableShowOutputOnTrace = vscode.commands.registerCommand(
                "liveSass.command.showOutputOn.trace",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.showOutputOn.trace"'
                    );

                    await SettingsHelper.updateOutputLogLevel(OutputLevel.Trace);
                }
            ),
            disposableShowOutputOnDebug = vscode.commands.registerCommand(
                "liveSass.command.showOutputOn.debug",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.showOutputOn.debug"'
                    );

                    await SettingsHelper.updateOutputLogLevel(OutputLevel.Debug);
                }
            ),
            disposableShowOutputOnInformation = vscode.commands.registerCommand(
                "liveSass.command.showOutputOn.information",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.showOutputOn.information"'
                    );

                    await SettingsHelper.updateOutputLogLevel(OutputLevel.Information);
                }
            ),
            disposableShowOutputOnWarning = vscode.commands.registerCommand(
                "liveSass.command.showOutputOn.warning",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.showOutputOn.warning"'
                    );

                    await SettingsHelper.updateOutputLogLevel(OutputLevel.Warning);
                }
            ),
            disposableShowOutputOnError = vscode.commands.registerCommand(
                "liveSass.command.showOutputOn.error",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.showOutputOn.error"'
                    );

                    await SettingsHelper.updateOutputLogLevel(OutputLevel.Error);
                }
            ),
            disposableShowOutputOnNone = vscode.commands.registerCommand(
                "liveSass.command.showOutputOn.none",
                async () => {
                    OutputWindow.Show(
                        OutputLevel.Trace,
                        'Command called: "liveSass.command.showOutputOn.none"'
                    );

                    await SettingsHelper.updateOutputLogLevel(OutputLevel.Critical);
                }
            ),
            disposableOnDidSave = vscode.workspace.onDidSaveTextDocument(async (textDocument) => {
                if (appModel.isWatching) {
                    OutputWindow.Show(OutputLevel.Trace, 'VS Code event: "onDidSaveTextDocument"');
                }

                // TODO: ADD - once autoprefixer can stop caching browserslist
                //await appModel.browserslistChecks();
                await appModel.compileOnSave(textDocument);
            });

        context.subscriptions.push(
            disposableStartWatching,
            disposableStopWaching,
            disposableOnDidSave,
            disposableOneTimeCompileSass,
            disposableCompileCurrentSass,
            disposableOpenOutputWindow,
            disposableCreateIssue,
            disposableDebugInclusion,
            disposableDebugFileList,
            disposableShowOutputOnTrace,
            disposableShowOutputOnDebug,
            disposableShowOutputOnInformation,
            disposableShowOutputOnWarning,
            disposableShowOutputOnError,
            disposableShowOutputOnNone,
            appModel
        );

        OutputWindow.Show(OutputLevel.Trace, "Live SASS commands ready", [
            "Commands have been saved and are ready to be used",
        ]);
    } catch (err) {
        if (err instanceof Error) {
            await new ErrorLogger(context.workspaceState).LogIssueWithAlert(
                `Unhandled error with Live Sass Compiler. Error message: ${err.message}`,
                {
                    error: ErrorLogger.PrepErrorForLogging(err),
                }
            );
        } else {
            await new ErrorLogger(context.workspaceState).LogIssueWithAlert(
                "Unhandled error with Live Sass Compiler. Error message: UNKNOWN (not Error type)",
                {
                    error: JSON.stringify(err),
                }
            );
        }
    }
}

export function deactivate(): void {
    // No actual actions are required

    OutputWindow.Show(OutputLevel.Trace, '"live-sass-compiler" deactivated');
}
