import { IModel, IModelVisitor } from '@start-app/form-builder-model';
import { get as resolveProperty } from 'object-path';
import { ComponentRegistry } from './component-registry';
import { ComponentState, IViewModel } from './interfaces';

export class ModelIdentity {
    private identity = 0;
    public get id(): number {
        return ++this.identity;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class ViewModelBuilderVisitor implements IModelVisitor {

    constructor(
        public model: IViewModel,
        private map: Map<number, IModel>,
        private modelToViewModelMap: Map<IModel, IViewModel>,
        private componentRegistry: ComponentRegistry,
        private modelIdentity: ModelIdentity
    ) {
        this.model.id = this.model.id === null ? this.modelIdentity.id : this.model.id;
    }

    public visitComponent(component: IModel): ViewModelBuilderVisitor {
        const newModel = this.componentRegistry.cloneModel(component.name, component.md);
        this.model.md = {
            ...newModel.md
        };

        this.map.set(this.model.id, component);
        this.modelToViewModelMap.set(component, this.model);
        return this;
    }

    public visitChildComponent(propertyName: string, component: IModel): ViewModelBuilderVisitor {
        const childModel = this.componentRegistry.cloneModel(component.name, component.md);
        const child: IViewModel = {
            id: this.modelIdentity.id,
            state: ComponentState.None,
            name: component.name,
            md: {
                ...childModel.md
            }
        };

        const property = resolveProperty(this.model.md, propertyName);

        if (Array.isArray(property)) {
            property.push(child);
            return new ViewModelBuilderVisitor(child, this.map, this.modelToViewModelMap, this.componentRegistry, this.modelIdentity);
        } else {
            property.id = child.id;
            property.state = child.state;
            property.name = child.name;
            property.md = {
                ...childModel.md
            };
            return new ViewModelBuilderVisitor(property, this.map, this.modelToViewModelMap, this.componentRegistry, this.modelIdentity);
        }
    }

    public leaveComponent() {
        // nothing to do
    }
}
