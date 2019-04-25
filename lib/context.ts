import * as React from 'react';
import { ComponentRegistry } from './controller/component-registry';
import { IComponentEvents, OnViewModelEvent } from './view/interfaces';

export interface IFormBuilderContext {
    registry: ComponentRegistry;
    events: IComponentEvents;
    onViewModel: OnViewModelEvent;
    onComponentModel: OnViewModelEvent;
}

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
    registry: null,
    events: null,
    onViewModel: null,
    onComponentModel: null
});
