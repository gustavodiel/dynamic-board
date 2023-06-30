import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import {BaseNode} from "../BaseNode";
import {Application} from "../../Application";
import {BaseNodeWidget} from "./BaseNodeWidget";

export class BaseNodeFactory extends AbstractReactFactory<BaseNode, DiagramEngine> {
    private app: Application;

    constructor(app: Application) {
        super('default');
        this.app = app;
    }

    generateReactWidget(event: { model: BaseNode; }): JSX.Element {
        return <BaseNodeWidget engine={this.engine} app={this.app} node={event.model} />;
    }

    generateModel(event: any): BaseNode {
        return new BaseNode('Model', 'red');
    }
}