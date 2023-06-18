import { getOrConvertToTwoWayBinding } from "@src/bindings/twoway/convertToTwoWay";
import { TwoWayBindable } from "@src/bindings/twoway/twowayBindable";
import { BuildOutput } from "@src/windows/buildOutput";
import { ParentControl } from "@src/windows/parentControl";
import { WidgetCreator } from "@src/windows/widgets/widgetCreator";
import { SizeParams } from "../../positional/size";
import { AbsolutePosition } from "../layouts/absolute/absolutePosition";
import { FlexiblePosition } from "../layouts/flexible/flexiblePosition";
import { ButtonControl, ButtonParams } from "./button";


/**
 * The parameters for configuring the toggle button.
 */
export interface ToggleParams extends Omit<ButtonParams, "isPressed" | "onClick">
{
	/**
	 * Whether the button is pressed down or not.
	 * @default false
	 */
	isPressed?: TwoWayBindable<boolean>;

	/**
	 * Triggers when the toggle button is pressed down or released.
	 */
	onChange?: (isPressed: boolean) => void;
}


/**
 * Add a button that can be toggled on and off.
 */
export function toggle(params: ToggleParams & FlexiblePosition): WidgetCreator<FlexiblePosition>;
export function toggle(params: ToggleParams & AbsolutePosition): WidgetCreator<AbsolutePosition>;
export function toggle<I extends SizeParams, P>(params: ToggleParams & I): WidgetCreator<I, P>
{
	return (parent, output) => new ToggleControl(parent, output, params);
}


/**
 * A controller class for a toggle button widget.
 */
class ToggleControl<I, P> extends ButtonControl<I, P> implements ButtonDesc, ToggleParams
{
	constructor(parent: ParentControl<I, P>, output: BuildOutput, params: ToggleParams & Omit<ButtonParams, "isPressed"> & I)
	{
		// Ensure isPressed is a two-way store, so we can update the live widget more easily.
		const toggled = getOrConvertToTwoWayBinding(params.isPressed, false);
		const store = toggled.twoway;

		params.isPressed = toggled;

		super(parent, output, <ButtonParams & I>params);
		output.binder.callback(this, "onClick", toggled, params.onChange, () => !store.get());
	}
}