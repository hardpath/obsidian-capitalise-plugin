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

				let transformed = selected;
				if (selected === selected.toLowerCase()) {
					transformed = capitaliseWords(selected);
				} else if (selected === capitaliseWords(selected)) {
					transformed = selected.toUpperCase();
				} else {
					transformed = selected.toLowerCase();
				}

				editor.replaceRange(transformed, from, to);
				// Reselect the transformed text
				editor.setSelection(from, { line: to.line, ch: from.ch + transformed.length });
			}
		});
	}
}
