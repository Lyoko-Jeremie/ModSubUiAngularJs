import type {LifeTimeCircleHook, LogWrapper} from "../../../dist-BeforeSC2/ModLoadController";
import type {AddonPluginHookPointEx} from "../../../dist-BeforeSC2/AddonPlugin";
import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
import {ExternalComponentManagerListName, ModSubUiAngularJsBody} from './ModSubUiAngularJsBody';
import {ModInfo} from "../../../dist-BeforeSC2/ModLoader";
import {ModZipReader} from "../../../dist-BeforeSC2/ModZipReader";
import {createOrderComponent} from "./AngularJs/Componnet/OrderComponent";
import {createEnableOrderComponent} from "./AngularJs/Componnet/EnableOrderComponent";

export const BuildInComponentList = [
    createOrderComponent,
    createEnableOrderComponent,
];

export class ModSubUiAngularJs extends ModSubUiAngularJsBody implements AddonPluginHookPointEx {
    private logger: LogWrapper;

    nowModName: string = 'ModSubUiAngularJs';

    constructor(
        public gSC2DataManager: SC2DataManager,
        public gModUtils: ModUtils,
    ) {
        super();
        this.logger = gModUtils.getLogger();
        this.gSC2DataManager.getAddonPluginManager().registerAddonPlugin(
            'ModSubUiAngularJs',
            'ModSubUiAngularJs',
            this,
        );
        const nn = this.gModUtils.getNowRunningModName();
        if (nn) {
            this.nowModName = nn;
            this.gModUtils.getMod(this.nowModName)!.modRef = this;
        } else {
            this.logger.error('ModSubUiAngularJs: nowModName is undefined. invalid state.');
        }
    }

    async registerMod(addonName: string, mod: ModInfo, modZip: ModZipReader): Promise<any> {
    }

    async whenSC2PassageEnd() {
    }

    protected buildInComponentInstalled: boolean = false;

    installBuildInComponent() {
        if (this.buildInComponentInstalled) {
            return;
        }
        this.buildInComponentInstalled = true;
        for (const name of ExternalComponentManagerListName) {
            for (const component of BuildInComponentList) {
                this.appContainerManager[name].registryComponent(component);
            }
        }
    }

}

