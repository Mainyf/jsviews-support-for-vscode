import { TextDocument, Position, CompletionItem } from 'vscode-languageserver';

export interface ICompletioner {
	onCompletion(document: TextDocument, position: Position): CompletionItem[];
}
