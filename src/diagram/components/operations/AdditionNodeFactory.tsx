import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import {BaseNode} from "../base/BaseNode";
import {Application} from "../../Application";
import {BaseNodeWidget} from "../base/BaseNodeWidget";
import {AdditionNodeModel} from "./AdditionNodeModel";

export class AdditionNodeFactory extends AbstractReactFactory<BaseNode, DiagramEngine> {
    private app: Application;

    constructor(app: Application) {
        super('addition');
        this.app = app;
    }

    generateReactWidget(event: { model: BaseNode; }): JSX.Element {
        return <BaseNodeWidget engine={this.engine} app={this.app} node={event.model} />;
    }

    generateModel(event: any): BaseNode {
        return new AdditionNodeModel('Model', 'green');
    }
}