import {
    NgAppContainer,
    getAngular,
    getNg
} from './AngularJs/appInit';
import type ng from "angular";
import {
    ExternalComponentManager,
    ExternalComponentRegistryInfo,
    ExternalComponentShowInfo
} from "./AngularJs/ExternalComponentManager";

const ExternalComponentManagerListName = [
    'ModGuiConfig',
    'ModInGameConfig',
] as const;

type ExternalComponentManagerListNameType = typeof ExternalComponentManagerListName[number];

export type bootstrapFunctionType = (el: HTMLElement) => void;
export type releaseFunctionType = () => void;
export type addComponentFunctionType = ExternalComponentManager['addComponent'];
export type registryComponentFunctionType = ExternalComponentManager['registryComponent'];

type AppContainerManagerMethodsType = {
    [K in ExternalComponentManagerListNameType as `bootstrap${ /*Capitalize<K>*/ K}`]: bootstrapFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `release${ /*Capitalize<K>*/ K}`]: releaseFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `addComponent${ /*Capitalize<K>*/ K}`]: addComponentFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `registryComponent${ /*Capitalize<K>*/ K}`]: registryComponentFunctionType;
};

interface AppContainerManagerMethodsInterface extends AppContainerManagerMethodsType {
}

export type AppContainerManagerMethodsInterfaceKey = keyof AppContainerManagerMethodsInterface;

export class AppContainerManager {
    ngAppContainerInstance?: NgAppContainer;

    constructor() {
        this.externalComponentManager = new ExternalComponentManager();
    }

    bootstrap(el: HTMLElement) {
        this.ngAppContainerInstance?.destroyApp();
        this.ngAppContainerInstance = new NgAppContainer(this.externalComponentManager);
        this.ngAppContainerInstance.installApp(el);
    }

    release() {
        this.ngAppContainerInstance?.destroyApp();
        this.ngAppContainerInstance = undefined;
    }

    protected externalComponentManager: ExternalComponentManager;

    addComponent<T>(componentInfo: ExternalComponentShowInfo<T>) {
        this.externalComponentManager.addComponent(componentInfo);
    }

    registryComponent<T>(componentInfo: ExternalComponentRegistryInfo) {
        this.externalComponentManager.registryComponent(componentInfo);
    }
}


export class ModSubUiAngularJsBodyBase {
    getNg: () => ng.IAngularStatic = getNg;
    getAngular: () => ng.IAngularStatic = getAngular;

    constructor() {
        this._appContainerManager = {} as any;
        ExternalComponentManagerListName.forEach((name) => {
            this._appContainerManager[name] = new AppContainerManager();
        });
    }

    protected _appContainerManager: { [key in ExternalComponentManagerListNameType]: AppContainerManager };

    get appContainerManager(): { [key in ExternalComponentManagerListNameType]: AppContainerManager } {
        return this._appContainerManager;
    }
}


type ModSubUiAngularJsBodyConstructorType = new () => ModSubUiAngularJsBodyBase & AppContainerManagerMethodsInterface;
type ModSubUiAngularJsBodyType = ModSubUiAngularJsBodyBase & AppContainerManagerMethodsInterface;

function AppContainerManagerMethodsFactory(): ModSubUiAngularJsBodyConstructorType {
    class ModSubUiAngularJsBodyEx extends ModSubUiAngularJsBodyBase {
        constructor() {
            super();
            ExternalComponentManagerListName.map((N) => {
                (this as any)['bootstrap' + N/*.trim()*/] = this._appContainerManager[N].bootstrap.bind(this._appContainerManager[N]);
                (this as any)['release' + N/*.trim()*/] = this._appContainerManager[N].release.bind(this._appContainerManager[N]);
                (this as any)['addComponent' + N/*.trim()*/] = this._appContainerManager[N].addComponent.bind(this._appContainerManager[N]);
                (this as any)['registryComponent' + N/*.trim()*/] = this._appContainerManager[N].registryComponent.bind(this._appContainerManager[N]);
            });
        }
    }

    return ModSubUiAngularJsBodyEx as unknown as ModSubUiAngularJsBodyConstructorType;
}

export class ModSubUiAngularJsBody extends AppContainerManagerMethodsFactory() implements AppContainerManagerMethodsInterface {
    // empty
    // ModSubUiAngularJsBody extends (extends ModSubUiAngularJsBodyBase implements AppContainerManagerMethodsInterface)
}

type ModSubUiAngularJsBodyKeys = keyof ModSubUiAngularJsBodyType;
