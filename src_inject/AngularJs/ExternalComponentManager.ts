import ng from "angular";
import {has, isString, isObject, isFunction} from 'lodash';
import {assert, is, ReturnType} from 'tsafe';
import {
    ComponentCreateCallback,
    ExternalComponentManagerInterface,
    ExternalComponentRegistryInfo,
    ExternalComponentShowInfo,
} from "./ExternalComponentManagerInterface";

export class ExternalComponentManager implements ExternalComponentManagerInterface {
    protected _externalComponentsShow: ExternalComponentShowInfo<any>[] = [];
    protected _externalComponentsRegistry: ExternalComponentRegistryInfo[] = [];

    protected _registeredComponents: string[] = [];

    protected isInit = false;

    constructor() {
    }

    registryComponent(componentRegistryInfo: ExternalComponentRegistryInfo) {
        if (this.isInit) {
            console.error('[ModSubUiAngularJs] Cannot registryComponent after fullFillComponent');
            return;
        }
        if (!isFunction(componentRegistryInfo)) {
            console.error('[ModSubUiAngularJs] componentRegistryInfo is not a function', componentRegistryInfo);
            return;
        }
        this._externalComponentsRegistry.push(componentRegistryInfo);
    }

    addComponent<T>(componentShowInfo: ExternalComponentShowInfo<T>) {
        this._externalComponentsShow.push(componentShowInfo);
    }

    cleanComponent() {
        this._externalComponentsShow = [];
    }

    fullFillComponent(
        _M: ng.IModule,
    ) {
        this.isInit = true;
        this._registeredComponents = this._externalComponentsRegistry.map((c) => {
            try {
                const R = c(_M);
                let selector = R.selector;
                if (isString(has(R, 'componentName')) && isObject(has(R, 'componentOptions'))) {
                    assert(is<ReturnType<ComponentCreateCallback>>(R));
                    _M.component(R.componentName, R.componentOptions);
                }
                return selector;
            } catch (e) {
                console.error('[ModSubUiAngularJs] Error in external component registry', e);
            }
        }).filter<string>((c): c is string => !!c);
    }

    get externalComponentsShow() {
        return this._externalComponentsShow;
    }

}
