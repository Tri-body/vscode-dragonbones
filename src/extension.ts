import * as vscode from 'vscode';
import { getWebViewContent, getRelativePath } from './utils';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('vsc-extension.openDBPreview', (uri: vscode.Uri) => {
		const panel = vscode.window.createWebviewPanel(
			'DBPreview',
			getRelativePath(uri),
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
			}
		);
		panel.webview.html = getWebViewContent(context, 'html/index.html');
		panel.webview.onDidReceiveMessage(data => {
			if (!data) return;
			const type = data.type;
			switch (type) {
				case 'preview_ready':
					if (fs.existsSync(uri.path)) {
						const content = fs.readFileSync(uri.path, { encoding: 'base64' })
						panel.webview.postMessage({ type: 'open_file', content });
					}
					break;
				default:
					break;
			}
		});
		panel.onDidDispose(() => {
			// console.log('panel is close.');
		});
	}));

}

export function deactivate() { }
