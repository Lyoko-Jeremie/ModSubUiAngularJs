import {
    NgAppContainer,
    getAngular,
    getNg
} from './AngularJs/appInit';
import type ng from "angular";
import {ExternalComponentManager} from "./AngularJs/ExternalComponentManager";
import {ExternalComponentRegistryInfo, ExternalComponentShowInfo} from "./AngularJs/ExternalComponentManagerInterface";
import {
    AppContainerManagerMethodsInterface,
    ExternalComponentManagerListName,
    ExternalComponentManagerListNameType,
} from "./AppContainerManagerMethodsInterface";

export class AppContainerManager {
    ngAppContainerInstance?: NgAppContainer;

    constructor(
        public nameApp: ExternalComponentManagerListNameType,
    ) {
        this.externalComponentManager = new ExternalComponentManager();
    }

    bootstrap(el: HTMLElement) {
        this.ngAppContainerInstance?.destroyApp();
        this.ngAppContainerInstance = new NgAppContainer(this.externalComponentManager, this.nameApp);
        return this.ngAppContainerInstance.installApp(el);
    }

    release() {
        this.ngAppContainerInstance?.destroyApp();
        this.ngAppContainerInstance = undefined;
    }

    protected externalComponentManager: ExternalComponentManager;

    addComponent<T>(componentInfo: ExternalComponentShowInfo<T>) {
        this.externalComponentManager.addComponent(componentInfo);
    }

    cleanComponent() {
        this.externalComponentManager.cleanComponent();
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
            this._appContainerManager[name] = new AppContainerManager(name);
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
                (this as any)['cleanComponent' + N/*.trim()*/] = this._appContainerManager[N].cleanComponent.bind(this._appContainerManager[N]);
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
