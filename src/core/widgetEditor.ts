import { Observable } from "../observables/observable";

/**
 * Small editor that allows editing both the template and active widget, if present.
 */
export class WidgetEditor<T extends Widget>
{
	constructor(readonly template: T, readonly active: T | undefined)
	{
	}

	get<K extends keyof T>(key: K): T[K]
	{
		return this.template[key];
	}

	set<K extends keyof T>(key: K, value: T[K] | Observable<T[K]>): void
	{
		const actual = (value instanceof Observable) ? value.get() : value;
		if (this.active)
		{
			this.active[key] = actual;
		}
		this.template[key] = actual;
	}
}
