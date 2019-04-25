import { IModel, IModelVisitor } from '@start-app/form-builder-model';
import { ComponentRegistry } from './component-registry';
import { IViewModel } from './interfaces';
export declare class ModelIdentity {
    private identity;
    readonly id: number;
}
export declare class ViewModelBuilderVisitor implements IModelVisitor {
    model: IViewModel;
    private map;
    private modelToViewModelMap;
    private componentRegistry;
    private modelIdentity;
    constructor(model: IViewModel, map: Map<number, IModel>, modelToViewModelMap: Map<IModel, IViewModel>, componentRegistry: ComponentRegistry, modelIdentity: ModelIdentity);
    visitComponent(component: IModel): ViewModelBuilderVisitor;
    visitChildComponent(propertyName: string, component: IModel): ViewModelBuilderVisitor;
    leaveComponent(): void;
}
