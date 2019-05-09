import { ICompletioner } from './completioner';
import { CompletionItemKind, TextDocument, Position, CompletionItem } from 'vscode-languageserver';

export default class ExpressionCompletion implements ICompletioner {
	
	onCompletion(document: TextDocument, position: Position): CompletionItem[] {
		return [
			{
				label: 'TypeScript',
				kind: CompletionItemKind.Field
			},
			{
				label: 'JavaScript',
				kind: CompletionItemKind.Field
			}
		];
	}

}