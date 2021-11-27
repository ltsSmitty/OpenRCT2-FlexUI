import { BuildOutput } from "@src/core/buildOutput";
import { defaultLineHeight } from "@src/core/defaults";
import { WidgetCreator } from "@src/core/widgetCreator";
import { Bindable } from "@src/observables/bindable";
import { Positions } from "@src/positional/positions";
import { isUndefined } from "@src/utilities/type";
import { Control } from "./control";
import { ElementParams } from "./element";


/**
 * The parameters for configuring the dropdown.
 */
export interface DropdownParams extends ElementParams
{
	/**
	 * Sets the items that will show up in the dropdown menu.
	 */
	items: Bindable<string[]>;

	/**
	 * sets the default selected item, indexed into the items array.
	 * @default 0
	 */
	selectedIndex?: Bindable<number>;

	/**
	 * Sets the message that will show when the dropdown is not available.
	 * @default undefined
	 */
	disabledMessage?: string;

	/**
	 * Automatically disables the dropdown if it has a single item.
	 * @default false
	 */
	disableSingleItem?: boolean;

	/**
	 * Triggers when the selected dropdown item changes.
	 */
	onSelect?: (index: number) => void;
}


/**
 * Create a dropdown widget with one or more selectable options.
 */
export function dropdown<TPos extends Positions>(params: DropdownParams & TPos): WidgetCreator<DropdownParams & TPos>
{
	return {
		params: params,
		create: (output: BuildOutput): DropdownControl => new DropdownControl(output, params)
	};
}


/**
 * A controller class for a dropdown widget.
 */
export class DropdownControl extends Control<DropdownWidget> implements DropdownWidget
{
	items: string[] = [];
	selectedIndex: number = 0;
	onChange: (index: number) => void;

	_disabledMessage: string | undefined;
	_disableSingleItem: boolean;
	_onSelect?: (index: number) => void;


	constructor(output: BuildOutput, params: DropdownParams & Positions)
	{
		super("dropdown", output, params);

		if (isUndefined(params.height))
			params.height = defaultLineHeight;

		const binder = output.binder;
		binder.add(this, "items", params.items);
		binder.add(this, "selectedIndex", params.selectedIndex);
		this.onChange = (idx): void => onChanged(this, idx);

		this._disabledMessage = params.disabledMessage;
		this._disableSingleItem = !!params.disableSingleItem;
		this._onSelect = params.onSelect;

		if (this._disabledMessage)
		{
			const items = this.items; // get local reference
			binder.on(params.disabled, this, "items", (value) => (value) ? [ this._disabledMessage as string ] : items);
		}
		if (this._disableSingleItem)
		{
			binder.on(params.items, this, "isDisabled", (value) => (!value || value.length <= 1));
		}
	}
}


/**
 * Called when the dropdown item is changed by the user.
 */
function onChanged(control: DropdownControl, index: number): void
{
	control.selectedIndex = index;

	if (control._onSelect)
	{
		control._onSelect(index);
	}
}