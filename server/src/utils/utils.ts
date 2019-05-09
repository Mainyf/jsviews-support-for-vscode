import os = require('os');
import some = require('lodash/some');

export function convertEnter(originText: string): string[] {
    return originText ? originText.split(os.EOL) : [];
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