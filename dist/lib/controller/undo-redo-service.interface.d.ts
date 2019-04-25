import { IModel } from '@start-app/form-builder-model';
export interface IUndoRedoService {
    undo(): IModel;
    redo(): IModel;
    push(model: IModel): void;
}
export declare const TUndoRedoService: unique symbol;
