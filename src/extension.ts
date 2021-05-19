import * as path from 'path';
import * as vscode from 'vscode';
import { getWebViewContent } from './utils';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('vsc-extension.openDBPreview', (uri) => {
		const panel = vscode.window.createWebviewPanel(
			'DBPreview',
			'DBPreview',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				// localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, '/html/app'))]
			}
		);
		panel.webview.html = getWebViewContent(context, 'html/app/index.html');
		panel.webview.onDidReceiveMessage(data => {
			const type = data?.type;
			switch (type) {
				case 'onload':
					panel.webview.postMessage({ type: 'select_file', uri: `vscode-file:${uri.path}` });
					break;
				default:
					break;
			}
		});
		panel.onDidDispose(() => {
			console.log('panel is close.');
		});
	}));

}

export function deactivate() { }
