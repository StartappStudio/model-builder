import { IModel } from '@start-app/form-builder-model';

export enum ComponentState {
    None = 'none',
    Selected = 'selected',
    Cut = 'cut'
}

export interface IComponentProperties {
    width?: string;
    height?: string;
    margin?: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    padding?: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    direction?: string;
    reverse?: boolean;
    space?: string;
    horizontal?: string;
    vertical?: string;
    wrap?: boolean;
    overflow?: any;
    constraints?: {
        maxHeight: string;
        maxWidth: string;
        minHeight: string;
        minWidth: string;
    };
    [k: string]: any;
}

export interface IContainerProperties extends IComponentProperties {
    components?: IViewModel[];
}

export interface IViewModel extends IModel {
    id: number;
    name: string;
    state: ComponentState;
    md: IComponentProperties;
}

export interface IViewModelProperties extends IComponentProperties {
    [key: string]: any;
}
