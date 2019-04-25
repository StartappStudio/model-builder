import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import { FormBuilderComponent } from '../components/form-builder-component';
import { ComponentRegistry } from './component-registry';
import { IComponentProperties, IViewModel } from './interfaces';

export interface IComponentDescriptor {
    name: string;
    resolveChildComponents: (model: IModel) => IChildComponentDescriptor[];
    cloneModel: (properties: object) => object;
    render: (model: IViewModel) => React.ReactElement<FormBuilderComponent>;
    registry?: ComponentRegistry;
    updateProperties?(model: IComponentProperties, viewModel: IComponentProperties): IComponentProperties;
 }
