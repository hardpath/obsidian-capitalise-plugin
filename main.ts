import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


export default class CapitalisePlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'shift-f3-cycle-case',
			name: 'Shift+F3: Cycle selection case',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				let selected = editor.getSelection();
				let from = editor.getCursor('from');
				let to = editor.getCursor('to');

				// Helper to capitalise each word
				function capitaliseWords(str: string): string {
					return str.replace(/\w\S*/g, (word) => {
						return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
					});
				}
				// Helper to capitalise first letter of each sentence, preserving spaces
				function sentenceCase(str: string): string {
					// Split by sentence-ending punctuation followed by space(s)
					return str.replace(/([^.!?]*[.!?]\s*)/g, (sentence) => {
						if (sentence.trim().length === 0) return sentence;
						// Find first non-space character
						const firstCharIndex = sentence.search(/\S/);
						if (firstCharIndex === -1) return sentence;
						return (
							sentence.slice(0, firstCharIndex) +
							sentence.charAt(firstCharIndex).toUpperCase() +
							sentence.slice(firstCharIndex + 1).toLowerCase()
						);
					});
				}

				// If no selection, find the word under the cursor
				if (selected.length === 0) {
					const line = editor.getLine(from.line);
					let start = from.ch;
					let end = from.ch;
					// Move start left to word boundary
					while (start > 0 && /[\w]/.test(line[start - 1])) {
						start--;
					}
					// Move end right to word boundary
					while (end < line.length && /[\w]/.test(line[end])) {
						end++;
					}
					if (start !== end) {
						selected = line.slice(start, end);
						from = { line: from.line, ch: start };
						to = { line: from.line, ch: end };
					} else {
						// No word under cursor
						return;
					}
				}

				// Detect if an entire line is selected
				const isFullLine = from.ch === 0 && to.ch === editor.getLine(from.line).length && from.line === to.line;

				let transformed = selected;
				if (isFullLine) {
					// Cycle: lowercase -> sentence case -> uppercase
					if (selected === selected.toLowerCase()) {
						transformed = sentenceCase(selected);
					} else if (selected === sentenceCase(selected)) {
						transformed = selected.toUpperCase();
					} else {
						transformed = selected.toLowerCase();
					}
				} else {
					// Default: lowercase -> capitalise each word -> uppercase
					if (selected === selected.toLowerCase()) {
						transformed = capitaliseWords(selected);
					} else if (selected === capitaliseWords(selected)) {
						transformed = selected.toUpperCase();
					} else {
						transformed = selected.toLowerCase();
					}
				}

				editor.replaceRange(transformed, from, to);
				// Reselect the transformed text
				editor.setSelection(from, { line: to.line, ch: from.ch + transformed.length });
			}
		});
	}
}
