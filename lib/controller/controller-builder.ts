import { FormModel, IModel, PropertiesFieldName } from '@start-app/form-builder-model';
import { EventEmitter, ListenerFn } from 'eventemitter3';
import { ComponentRegistry } from './component-registry';
import { ComponentState, IViewModel } from './interfaces';
import { ModelIdentity, ViewModelBuilderVisitor } from './view-model-builder-visitor';

type Action = 'select' | 'deselect' | 'cancelSelection' | 'clear' | 'insert' | 'cut' | 'copy' | 'paste' | 'updateModel' | 'delete';

type SelectPayload = IViewModel | IViewModel[];

interface IInsertPayload {
    item: IModel;
    parent: IViewModel;
}

type Payload = SelectPayload | IInsertPayload | IModel | IModel[];

interface IActionMap {
    [key: string]: (payload?: Payload) => any;
}

export enum EChangeEvents {
    ModelChange = 'ModelChange',
    ViewModelSelect = 'ViewModelSelect',
    PropertiesChange = 'PropertiesChange',
    SelectMany = 'SelectMany'
}

export class ControllerBuilder {

    private onChange = new EventEmitter<string>();

    private modelInternal: FormModel;
    private viewModelInternal: IViewModel;
    private identityToModelMap = new Map<number, IModel>();
    private modelToViewModelMap = new Map<IModel, IViewModel>();

    private selected: IViewModel[] = [];
    private copied: IViewModel[] = [];

    private actionMap: IActionMap = {
        select: (payload: Payload) => this.select(payload as SelectPayload, ComponentState.Selected),
        deselect: (payload: Payload) =>  this.select(payload as SelectPayload, ComponentState.None),
        cancelSelection: () => this.clearSelected(),
        clear: () => this.clear(),
        insert: (payload: Payload) => this.insert(payload as IInsertPayload),
        cut: () => this.cut(),
        copy: () => this.copy(),
        paste: (payload: IModel[]) => this.paste(payload),
        updateModel: (payload: Payload) => this.updateModel(payload as IModel),
        delete: () => this.delete()
    };

    constructor(private componentRegistry: ComponentRegistry, private propsName: PropertiesFieldName) { }

    public on(event: string, fn: ListenerFn, context?: any) {
        this.onChange.on(event, fn, context);
    }

    public off(event: string, fn?: ListenerFn, context?: any, once?: boolean) {
        this.onChange.off(event, fn, context, once);
    }


    public dispatch(action: Action, payload?: Payload): any {
        if (!this.actionMap[action]) {
            throw Error(`Unknown action: ${action}`);
        }

        const result = this.actionMap[action](payload);
        return result;
    }

    public get viewModel() {
        return this.viewModelInternal;
    }

    public set model(value: IModel) {
        this.modelInternal = new FormModel(value, (model) => this.componentRegistry.resolveChildComponents(model), this.propsName);

        if (!value) {
            return;
        }

        this.viewModelInternal = this.makeViewModel(this.modelInternal);
    }

    public get model(): IModel {
        if (!this.modelInternal) {
            return undefined;
        }

        return this.modelInternal.model;
    }

    private makeViewModel(model: FormModel): IViewModel {
        this.identityToModelMap.clear();
        this.modelToViewModelMap.clear();
        this.selected = [];
        this.copied = [];

        const containerModel = this.componentRegistry.cloneModel('container');
        const viewModelBuilder = new ViewModelBuilderVisitor(
            {
                id: null,
                state: ComponentState.None,
                name: containerModel.name,
                md: {
                    ...containerModel[this.propsName]
                }
            },
            this.identityToModelMap,
            this.modelToViewModelMap,
            this.componentRegistry,
            new ModelIdentity()
        );

        model.accept(viewModelBuilder);
        return viewModelBuilder.model;
    }

    private select(component: SelectPayload, select: ComponentState) {
        let items: IViewModel[];
        if (component instanceof Array) {
            items = component.map((item) => {
                this.selectOne(item, select);
                return item;
            });
        } else {
            items = [this.selectOne(component, select)];
        }

        this.onChange.emit(EChangeEvents.SelectMany, items);
    }

    private selectOne(component: IViewModel, select: ComponentState): IViewModel {
        if (component.state === ComponentState.Selected  &&
            select === ComponentState.Selected ||
            select === ComponentState.None
        ) {
            component.state = ComponentState.None;
        } else {
            component.state = ComponentState.Selected;
        }
        if (component.state === ComponentState.Selected) {
            this.selected.push(component);
        } else {
            for (let i = 0; i < this.selected.length; i++) {
                if (this.selected[i] === component) {
                    this.selected.splice(i, 1);
                }
            }
        }
        if (component.state === ComponentState.Selected) {
            this.onChange.emit(EChangeEvents.ViewModelSelect, this.identityToModelMap.get(component.id));
        }

        return component;
    }

    private clearSelected() {
        const result = [...this.selected];

        while (this.selected.length) {
            const item = this.selected.pop();
            item.state = ComponentState.None;
        }

        this.onChange.emit(EChangeEvents.SelectMany, result);
    }

    private clearCopied(): void {
        const result = [this.copied];
        while (this.copied.length) {
            const item = this.copied.pop();
            item.state = ComponentState.None;
        }

        this.onChange.emit(EChangeEvents.SelectMany, result);
    }

    private clear(): IViewModel[] {
        const result = [...this.selected, ...this.copied];
        this.clearSelected();
        this.clearCopied();

        this.onChange.emit(EChangeEvents.SelectMany, result);
        return result;
    }

    private insert(payload: IInsertPayload): void {
        this.internalInsert(payload);
        this.modelInternal.commit();
        this.viewModelInternal = this.makeViewModel(this.modelInternal);
        this.emitModelChange();
    }

    private internalInsert(payload: IInsertPayload): void {
        const ref = this.findParentModel(payload.parent);
        this.modelInternal.insert(payload.item, ref);
    }

    private findParentModel(parentViewModel: IViewModel): IModel {
        if (this.identityToModelMap.has(parentViewModel.id)) {
            return this.identityToModelMap.get(parentViewModel.id);
        } else {
            throw Error(`Cannot find parent model for view model`);
        }
    }

    private cut(): IViewModel[] {
        const result = [...this.selected];
        this.selected.forEach((item) => {
            if (item.state === ComponentState.Selected) {
                item.state = ComponentState.Cut;
            }
        });
        this.copy();
        this.onChange.emit(EChangeEvents.SelectMany, result);
        return result;
    }

    private copy() {
        if (this.selected.length) {
            this.copied = this.selected;
            this.selected = [];
        }

        return this.copied.map((item) => this.identityToModelMap.get(item.id));
    }

    private paste(models: IModel[]) {
        this.selected.forEach((selected) => {
            const parent = this.identityToModelMap.get(selected.id);
            if (this.copied.length) {
                this.copied.forEach((container) => {
                    const src = this.identityToModelMap.get(container.id);
                    if (container.state === ComponentState.Cut) {
                        this.cutModel(src, parent);
                    } else {
                        this.copyModel(src, parent);
                    }
                });
            } else {
                if (models && models.length) {
                    models.forEach((model) => {
                        this.internalInsert({ item: model, parent: selected  });
                    });
                }
            }
        });

        this.modelInternal.commit();

        this.viewModelInternal = this.makeViewModel(this.modelInternal);
        this.emitModelChange();
    }

    private cutModel(src, parent) {
        this.modelInternal.insert(src, parent);
        this.modelInternal.remove(src);
    }

    private copyModel(src, parent) {
        this.modelInternal.insert(JSON.parse(JSON.stringify(src)), parent);
    }

    private delete() {
        this.selected.forEach((item) => {
            const model = this.identityToModelMap.get(item.id);
            this.modelInternal.remove(model);
        });

        this.modelInternal.commit();
        this.viewModelInternal = this.makeViewModel(this.modelInternal);
        this.emitModelChange();
    }

    private updateModel(model: IModel) {
        const viewModel = this.modelToViewModelMap.get(model);
        this.componentRegistry.updateProperties(viewModel, model);
        this.onChange.emit(EChangeEvents.PropertiesChange, viewModel);
    }

    private emitModelChange() {
        this.onChange.emit(EChangeEvents.ModelChange, this.modelInternal.model);
    }
}

export const TControllerBuilderFactory = 'TControllerBuilderFactory';
