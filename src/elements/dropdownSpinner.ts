import { BuildOutput } from "@src/core/buildOutput";
import { WidgetCreator } from "@src/core/widgetCreator";
import { WidgetMap } from "@src/core/widgetMap";
import { fillLayout } from "@src/layouts/fillLayout";
import { isObservable } from "@src/observables/isObservable";
import { observable } from "@src/observables/observableConstructor";
import { AbsolutePosition } from "@src/positional/absolutePosition";
import { FlexiblePosition } from "@src/positional/flexiblePosition";
import { Positions } from "@src/positional/positions";
import { Rectangle } from "@src/positional/rectangle";
import { DropdownControl, DropdownParams } from "./dropdown";
import { SpinnerControl, SpinnerParams, SpinnerWrapMode } from "./spinner";


/**
 * The parameters for configuring the spinner.
 */
export interface DropdownSpinnerParams extends DropdownParams
{
	/**
	 * Sets whether the spinner value wraps around or clamps to its boundaries.
	 * @default "wrap"
	 */
	wrapMode?: SpinnerWrapMode;
}


/**
 * Create a dropdown widget with multiple selectable options, which can be navigated
 * through with [+] and [-] buttons from a spinner widget.
 */
export function dropdownSpinner(params: DropdownSpinnerParams & FlexiblePosition): WidgetCreator<DropdownSpinnerParams & FlexiblePosition>;
export function dropdownSpinner(params: DropdownSpinnerParams & AbsolutePosition): WidgetCreator<DropdownSpinnerParams & AbsolutePosition>;
export function dropdownSpinner(params: DropdownSpinnerParams & Positions): WidgetCreator<DropdownSpinnerParams>
{
	return {
		params: params,
		create: (output: BuildOutput): DropdownSpinnerControl => new DropdownSpinnerControl(output, params)
	};
}


const spinnerControlsWidth = 25;


/**
 * A dropdown with a spinner control on the side.
 */
class DropdownSpinnerControl extends DropdownControl
{
	_spinner: SpinnerControl;

	constructor(output: BuildOutput, params: DropdownSpinnerParams)
	{
		// Setup internal spinner control
		const spinParams: SpinnerParams =
		{
			tooltip: params.tooltip,
			minimum: 0,
			maximum: 0,
			// update dropdown
			onChange: (value: number) => this.onChange(value)
		};
		const items = params.items;
		if (isObservable(items))
		{
			const maximum = observable(0);
			items.subscribe(v => maximum.set((v) ? v.length : 0));
			spinParams.maximum = maximum;
		}
		else if (items)
		{
			spinParams.maximum = items.length;
		}
		const spinner = new SpinnerControl(output, spinParams);

		super(output, params);
		this._spinner = spinner;

		const inheritedCallback = this.onChange;
		this.onChange = (idx): void =>
		{
			this._spinner._value.set(idx);
			inheritedCallback(idx);
		};
	}


	/**
	 * Positions the two widgets in the proper location.
	 */
	override layout(widgets: WidgetMap, area: Rectangle): void
	{
		// Position spinner (only show controls next to dropdown)
		fillLayout(widgets, this._spinner.name, area);

		// Position dropdown (leave space for spinner controls)
		area.width -= spinnerControlsWidth;
		fillLayout(widgets, this.name, area);
	}
}
