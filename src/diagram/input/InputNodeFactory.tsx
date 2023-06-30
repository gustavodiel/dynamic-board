import { InputNodeWidget } from './InputNodeWidget';
import { InputNodeModel } from './InputNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import {Application} from "../Application";

export class InputNodeFactory extends AbstractReactFactory<InputNodeModel, DiagramEngine> {
    private app: Application;

    constructor(app: Application) {
        super('input');
        this.app = app;
    }

    generateReactWidget(event: { model: InputNodeModel; }): JSX.Element {
        return <InputNodeWidget engine={this.engine} app={this.app} node={event.model} />;
    }

    generateModel(event: any): InputNodeModel {
        return new InputNodeModel('Model', 'red');
    }
}