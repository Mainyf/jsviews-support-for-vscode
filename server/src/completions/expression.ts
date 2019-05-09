import { ICompletioner } from '../types/completioner';
import { CompletionItemKind, TextDocument, Position, CompletionItem } from 'vscode-languageserver';

@completion()
class ExpressionCompletion implements ICompletioner {
	
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