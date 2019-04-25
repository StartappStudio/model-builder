import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { ComponentHost } from '../view/component-host';
import { IComponentDescriptor } from './component-descriptor';
import { IViewModel } from './interfaces';

export class ComponentRegistry {
    private components = new Map<string, IComponentDescriptor>();

    public register(componentDescriptor: IComponentDescriptor) {
        this.components.set(componentDescriptor.name, componentDescriptor);
        componentDescriptor.registry = this;
    }

    public resolveChildComponents(model: IModel): IChildComponentDescriptor[] {
        const component = this.findComponent(model.name);
        return component.resolveChildComponents(model);
    }

    public cloneModel(name: string, properties: object = {}): IModel {
        const component = this.findComponent(name);

        return {
            name,
            md: component.cloneModel(properties)
        };
    }

    public render(model: IViewModel, index?: number): React.ReactElement<ComponentHost> {
        const descriptor = this.findComponent(model.name);

        return <ComponentHost descriptor={descriptor} model={model} key={index} />;
    }

    public updateProperties(viewModel: IViewModel, model: IModel) {
        const descriptor = this.findComponent(model.name);
        viewModel.md = descriptor.updateProperties(model.md, viewModel.md);
    }

    private findComponent(name: string): IComponentDescriptor {
        if (!this.components.has(name)) {
            return this.components.get('DefaultComponent');
        }

        return this.components.get(name);
    }
}
