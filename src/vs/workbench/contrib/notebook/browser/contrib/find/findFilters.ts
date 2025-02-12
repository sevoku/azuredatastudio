/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from 'vs/base/common/lifecycle';
import { Event, Emitter } from 'vs/base/common/event';

export interface INotebookFindFiltersChangeEvent {
	markupInput?: boolean;
	markupPreview?: boolean;
	codeInput?: boolean;
	codeOutput?: boolean;
}

export class NotebookFindFilters extends Disposable {
	private readonly _onDidChange: Emitter<INotebookFindFiltersChangeEvent> = this._register(new Emitter<INotebookFindFiltersChangeEvent>());
	readonly onDidChange: Event<INotebookFindFiltersChangeEvent> = this._onDidChange.event;

	private _markupInput: boolean = true;

	get markupInput(): boolean {
		return this._markupInput;
	}

	set markupInput(value: boolean) {
		if (this._markupInput !== value) {
			this._markupInput = value;
			this._onDidChange.fire({ markupInput: value });
		}
	}

	private _markupPreview: boolean = true;

	get markupPreview(): boolean {
		return this._markupPreview;
	}

	set markupPreview(value: boolean) {
		if (this._markupPreview !== value) {
			this._markupPreview = value;
			this._onDidChange.fire({ markupPreview: value });
		}
	}
	private _codeInput: boolean = true;

	get codeInput(): boolean {
		return this._codeInput;
	}

	set codeInput(value: boolean) {
		if (this._codeInput !== value) {
			this._codeInput = value;
			this._onDidChange.fire({ codeInput: value });
		}
	}

	private _codeOutput: boolean = true;

	get codeOutput(): boolean {
		return this._codeOutput;
	}

	set codeOutput(value: boolean) {
		if (this._codeOutput !== value) {
			this._codeOutput = value;
			this._onDidChange.fire({ codeOutput: value });
		}
	}

	constructor(
		markupInput: boolean,
		markupPreview: boolean,
		codeInput: boolean,
		codeOutput: boolean
	) {
		super();

		this._markupInput = markupInput;
		this._markupPreview = markupPreview;
		this._codeInput = codeInput;
		this._codeOutput = codeOutput;
	}

	update(v: NotebookFindFilters) {
		this._markupInput = v.markupInput;
		this._markupPreview = v.markupPreview;
		this._codeInput = v.codeInput;
		this._codeOutput = v.codeOutput;
	}
}
