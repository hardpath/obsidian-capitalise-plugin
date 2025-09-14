import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


export default class CapitalisePlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'shift-f3-cycle-case',
			name: 'Shift+F3: Cycle selection case',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selected = editor.getSelection();
				if (selected.length > 0) {
					let transformed = selected;
					// Helper to capitalise each word
					function capitaliseWords(str: string): string {
						return str.replace(/\w\S*/g, (word) => {
							return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
						});
					}

					if (selected === selected.toLowerCase()) {
						transformed = capitaliseWords(selected);
					} else if (selected === capitaliseWords(selected)) {
						transformed = selected.toUpperCase();
					} else {
						transformed = selected.toLowerCase();
					}

					const range = editor.listSelections()[0];
					editor.replaceSelection(transformed);
					// Reselect the transformed text
					if (range) {
						const anchor = range.anchor;
						const head = range.head;
						// After replacement, selection moves to end, so recalculate
						const start = editor.posToOffset(anchor) < editor.posToOffset(head) ? anchor : head;
						const end = editor.posToOffset(anchor) < editor.posToOffset(head) ? head : anchor;
						editor.setSelection(start, end);
					}
				}
			}
		});
	}
}
