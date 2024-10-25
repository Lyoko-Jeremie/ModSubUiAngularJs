import {ExternalComponentRegistryInfo, ExternalComponentShowInfo} from "./AngularJs/ExternalComponentManagerInterface";

export const ExternalComponentManagerListName = [
    'ModGuiConfig',
    'ModInGameConfig',
] as const;

export type ExternalComponentManagerListNameType = typeof ExternalComponentManagerListName[number];

export type bootstrapFunctionType = (el: HTMLElement) => void;
export type releaseFunctionType = () => void;
export type addComponentFunctionType = <T>(componentShowInfo: ExternalComponentShowInfo<T>) => void;
export type cleanComponentFunctionType = () => void;
export type registryComponentFunctionType = (componentRegistryInfo: ExternalComponentRegistryInfo) => void;

export type AppContainerManagerMethodsType = {
    [K in ExternalComponentManagerListNameType as `bootstrap${ /*Capitalize<K>*/ K}`]: bootstrapFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `release${ /*Capitalize<K>*/ K}`]: releaseFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `addComponent${ /*Capitalize<K>*/ K}`]: addComponentFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `cleanComponent${ /*Capitalize<K>*/ K}`]: cleanComponentFunctionType;
} & {
    [K in ExternalComponentManagerListNameType as `registryComponent${ /*Capitalize<K>*/ K}`]: registryComponentFunctionType;
};

export interface AppContainerManagerMethodsInterface extends AppContainerManagerMethodsType {
    addComponent: addComponentFunctionType;
    cleanComponent: cleanComponentFunctionType;
    registryComponent: registryComponentFunctionType;
}

export type AppContainerManagerMethodsInterfaceKey = keyof AppContainerManagerMethodsInterface;
