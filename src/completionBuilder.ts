import * as vscode from 'vscode';

class CompletionBuilder {

    private _label: string = '';
    private _kind: vscode.CompletionItemKind = vscode.CompletionItemKind.Keyword;
    private _insertText: string | vscode.SnippetString = '';

    public label(value: string): CompletionBuilder {
        this._label = value;
        return this;
    }

    public kind(value: vscode.CompletionItemKind): CompletionBuilder {
        this._kind = value;
        return this;
    }

    public insertText(value: string | vscode.SnippetString): CompletionBuilder {
        this._insertText = value;
        return this;
    }

    public build(): vscode.CompletionItem {
        const result = new vscode.CompletionItem(this._label, this._kind);
        result.insertText = this._insertText;
        return result;
    }
}

export function completion(label: string): CompletionBuilder {
    return (new CompletionBuilder()).label(label);
}