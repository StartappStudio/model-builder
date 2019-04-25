import * as React from 'react';
import { FormBuilderContext } from '../context';
import { IComponentDescriptor } from '../controller/component-descriptor';
import { IViewModel } from '../controller/interfaces';
export interface IComponentHostProps {
    model: IViewModel;
    descriptor: IComponentDescriptor;
}
export declare class ComponentHost extends React.Component<IComponentHostProps> {
    static contextType: React.Context<import("../context").IFormBuilderContext>;
    context: React.ContextType<typeof FormBuilderContext>;
    private containerElement;
    private badgeElement;
    private active;
    constructor(props: IComponentHostProps);
    render(): JSX.Element;
    private setActive;
    private resetActive;
    private onDragOver;
    private onDrop;
    private updateModel;
}
