import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import * as React from 'react';
import { IComponentDescriptor } from '../../controller/component-descriptor';
import { IComponentProperties, IContainerProperties, IViewModel } from '../../controller/interfaces';
import { FormBuilderComponent } from '../form-builder-component';
export declare class ContainerComponentDescriptor implements IComponentDescriptor {
    name: string;
    resolveChildComponents(model: IModel): IChildComponentDescriptor[];
    cloneModel(properties?: IContainerProperties): object;
    updateProperties(model: IComponentProperties, viewModel: IComponentProperties): IComponentProperties;
    render(model: IViewModel): React.ReactElement<FormBuilderComponent>;
}
