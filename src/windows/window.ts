import { defaultWindowPadding } from "@src/elements/constants";
import { FlexibleDirectionalLayoutParams } from "@src/elements/layouts/flexible/flexible";
import { Colour } from "@src/utilities/colour";
import * as Log from "@src/utilities/logger";
import { isUndefined } from "@src/utilities/type";
import { BaseWindowControl, BaseWindowParams, defaultTopBarSize } from "./baseWindowControl";
import { FrameBuilder } from "./frames/frameBuilder";
import { FrameControl } from "./frames/frameControl";
import { TabLayoutable } from "./tabs/tabLayoutable";
import { WidgetMap, addToWidgetMap } from "./widgets/widgetMap";
import { WindowTemplate } from "./windowTemplate";


/**
 * The parameters for a regular window.
 */
export interface WindowParams extends BaseWindowParams, FlexibleDirectionalLayoutParams
{
	/**
	 * The colours of the window.
	 *
	 * Usage:
	 *  1. Used for the window background.
	 *  2. Used for widget backgrounds.
	 */
	colours?: [Colour, Colour];
}


/**
 * Create a new flexiblely designed window.
 */
export function window(params: WindowParams): WindowTemplate
{
	Log.debug("window() started");
	const startTime = Log.time();

	if (isUndefined(params.padding))
	{
		params.padding = defaultWindowPadding;
	}
	const template = new WindowControl(params);

	Log.debug("window() creation time:", (Log.time() - startTime), "ms");
	return template;
}


/**
 * A window control for simple windows without tabs.
 */
class WindowControl extends BaseWindowControl
{
	private _frame: FrameControl;
	protected override _descriptionWidgetMap: WidgetMap;


	constructor(params: WindowParams)
	{
		super(params);

		const builder = new FrameBuilder(this, params, params);
		const widgets = builder._widgets;
		this._description.widgets = widgets;
		this._descriptionWidgetMap = addToWidgetMap(widgets);
		this._frame =  builder.context;
	}

	protected override _invoke(callback: (frame: TabLayoutable) => void): void
	{
		callback(this._frame);
	}

	override _layout(window: Window | WindowDesc, widgets: WidgetMap): void
	{
		const area = this._createFrameRectangle(this._flags);
		const size = this._frame.layout(area, widgets);

		this._setAutoWindowSize(window, size, defaultTopBarSize);
	}
}