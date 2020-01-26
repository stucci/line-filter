// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "line-filter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.lineFilter', () => {
		// The code you place here will be executed every time your command is executed

		// Get text of active editor
		const editor = vscode.window.activeTextEditor!;
		const doc = editor.document;
		let curSelection = editor.selection;
		const startPos = new vscode.Position(0, 0);
		const endPos = new vscode.Position(doc.lineCount - 1, 10000);
		curSelection = new vscode.Selection(startPos, endPos);

		// create QuickPickItem
		const text = doc.getText(curSelection).replace(/\r/g, '');
		const line = text.split('\n');
		const obj = Object.assign({}, line);
		const items: Array<vscode.QuickPickItem> = Object.entries(obj).map(([key, value]) => ({'label': value, 'description': key}));
		const filtered = items.filter(element => element.label!=='');

		vscode.window.showQuickPick(filtered)
			.then(selected => {
				const position = editor.selection.active;
				const newPosition = position.with(Number(selected!.description), 0);
				const newSelection = new vscode.Selection(newPosition, newPosition);
				editor.selection = newSelection;
				editor.revealRange(newSelection, 1);
			});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
