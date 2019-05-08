import * as vscode from 'vscode';
import {
	TextDocument,
	Position,
	CancellationToken,
	CompletionContext,
	ProviderResult,
	CompletionItem,
	CompletionList,
	CompletionItemKind
} from 'vscode';
import { convertEnter } from './utils';
import some from 'lodash/some';
import { completion } from './completionBuilder';

let prevText: string[] = [];

export function activate(context: vscode.ExtensionContext) {
	vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
		const text = convertEnter(event.document.getText());
		if (text.length === prevText.length) {
			vscode.commands.executeCommand('editor.action.triggerSuggest');
		}
		prevText = text.concat([]);
	});

	const provider1 = vscode.languages.registerCompletionItemProvider('html', {
		provideCompletionItems(
			document: TextDocument,
			position: Position,
			token: CancellationToken,
			context: CompletionContext
		): ProviderResult<CompletionItem[] | CompletionList> {
			const textLines = convertEnter(document.getText());
			if (!textLines || !textLines.length || textLines.length < position.line) {
				return;
			}
			const currentLine = textLines[position.line];
			const leftText = currentLine.slice(0, position.character);
			const rightText = currentLine.substring(position.character);

			if (hasInScript(textLines, position.line)) {
				const leftCount = getStrCount(leftText, '{');
				const rightCount = getStrCount(rightText, '}');
				// {{ and }} not exists
				if (leftCount < 2 && rightCount < 2) {
					const expression = new vscode.CompletionItem('{{:expression}}', CompletionItemKind.Keyword);
					expression.insertText = new vscode.SnippetString(`${generateStr('{', 2 - leftCount)}\$\{1\}${generateStr('}', 2 - rightCount)}`);
					return [
						expression
					];
				} else {
					const expression = new vscode.CompletionItem('{{if expression}}', CompletionItemKind.Keyword);
					expression.insertText = new vscode.SnippetString(`${generateStr('{', 2 - leftCount)}\$\{1\}${generateStr('}', 2 - rightCount)}`);
				}
			}
			return [];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and iff so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('console.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(provider1, provider2);
}

function getStartKeywordCompletion(): ProviderResult<CompletionItem[] | CompletionList> {
	return [
		completion('{{if expression}}').insertText('if ${1}').build(),
		completion('{{for expression}}').insertText('for ${1}').build(),
	];
}

const scriptLeftRegex = /.*<script.*type="text\/x-jsrender".*>.*/;
const scriptRightRegex = /.*<\/script>.*/;

function hasInScript(texts: string[], index: number): boolean {
	const topTexts = texts.slice(0, index);
	const buttomTexts = texts.slice(index, texts.length);
	return some(topTexts, (v) => scriptLeftRegex.test(v)) && some(buttomTexts, (v) => scriptRightRegex.test(v));
}

function getStrCount(origin: string, str: string): number {
	return origin.split('').reduce((prev, v) => v === str ? prev + 1 : prev, 0);
}

function generateStr(str: string, count: number): string {
	let result = '';
	for (let i = 0; i < count; i++) {
		result += str;
	}
	return result;
}

// export function deactivate() { }
