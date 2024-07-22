import {ModWebpackExampleTs_patchLinkButton} from "./preload";

export {};

declare global {
    interface Window {
        modUtils: ModUtils;
        modSC2DataManager: SC2DataManager;

        modImgLoaderHooker: ImgLoaderHooker;

        jQuery: jQuery;
    }

    var Macro: {
        add: (name: string | string[], def) => any;
        delete: (name: string) => any;
        isEmpty: () => any;
        has: (name: string) => any;
        get: (name: string) => any;
    };

}
