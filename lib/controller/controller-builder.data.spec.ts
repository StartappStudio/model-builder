import { IChildComponentDescriptor, IModel } from '@start-app/form-builder-model';
import { IComponentDescriptor } from './component-descriptor';

// tslint:disable max-classes-per-file

export class ComponentWithTwoContainers implements IComponentDescriptor {
    public name: string = 'twoContainersComponent';

    public resolveChildComponents(model: IModel): IChildComponentDescriptor[] {
        return [{
            property: 'container1',
            model:  model.md.container1
        }, {
            property: 'container2',
            model:  model.md.container2
        }];
    }

    public cloneModel(): object {
        return  {
            container1: [],
            container2: []
        };
    }

    public render() {
        return null;
    }
}

export class ComponentWithChildComponents implements IComponentDescriptor {
    public name: string = 'childComponents';

    public resolveChildComponents(model: IModel): IChildComponentDescriptor[] {
        return [{
            property: 'child1',
            model: model.md.child1
        }, {
            property: 'child2',
            model: model.md.child2
        }];
    }

    public cloneModel(): object {
        return  {
            child1: {
                name: 'container',
                md: {
                    components: []
                }
            },
            child2: {
                name: 'container',
                md: {
                    components: []
                }
            }
        };
    }

    public render() {
        return null;
    }
}

export class TabControlComponent implements IComponentDescriptor {

    public name = 'tab-control';

    public resolveChildComponents(model: IModel): IChildComponentDescriptor[] {
        return model.md.tabs.map((tab, index) => {
            return {
                property: `tabs.${index}.container`,
                model: tab.container
            };
        });
    }

    public cloneModel(properties: any = {}): object {
        return {
            ...properties,
            tabs: properties.tabs.map((tab) => {
                return {
                    ...tab,
                    container: {
                        ...tab.container,
                        components: []
                    }
                };
            })
        };
    }

    public render() {
        return null;
    }
}
