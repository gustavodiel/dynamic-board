import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';
import {InputNodeModel} from "../input/InputNodeModel";
import {BaseNode} from "./BaseNode";
import {AdditionNodeModel} from "./operations/AdditionNodeModel";
import {MultiplicationNodeModel} from "./operations/MultiplicationNodeModel";
import {DivisionNodeModel} from "./operations/DivisionNodeModel";
import {SubtractionNodeModel} from "./operations/SubtractionNodeModel";
import {useState} from "react";

export interface BodyWidgetProps {
    app: Application;
}

namespace S {
    export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

    export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

    export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

    export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;
}

export const BodyWidget = ({ app }: BodyWidgetProps) => {
    const [, updateState] = React.useState();
    // @ts-ignore
    const forceUpdate = React.useCallback(() => updateState({}), []);

    app.afterUpdate(() => {
        forceUpdate()
    });

    return (
        <S.Body>
            <S.Header>
                <div className="title">Dynamic Board!</div>
            </S.Header>
            <S.Content>
                <TrayWidget>
                    <TrayItemWidget model={{ type: 'in' }} name="Output Node" color="rgb(192,255,0)" />
                    <TrayItemWidget model={{ type: 'out' }} name="Input Node" color="rgb(0,192,255)" />
                    <TrayItemWidget model={{ type: 'add' }} name="+ Node" color="rgb(0,0,255)" />
                    <TrayItemWidget model={{ type: 'mult' }} name="* Node" color="rgb(0,40,255)" />
                    <TrayItemWidget model={{ type: 'div' }} name="/ Node" color="rgb(0,80,255)" />
                    <TrayItemWidget model={{ type: 'sub' }} name="- Node" color="rgb(0,160,255)" />
                </TrayWidget>
                <S.Layer
                    onDrop={(event) => {
                        const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
                        const nodesCount = _.keys(app.getDiagramEngine().getModel().getNodes()).length;

                        let node: BaseNode | null = null;
                        switch (data.type) {
                            case 'in':
                                node = new BaseNode('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
                                node.addInPort('In');
                                break;
                            case 'out':
                                node = new InputNodeModel('Input ' + (nodesCount + 1), 'rgb(0,192,255)');
                                node.addOutPort('Out');
                                break;
                            case 'add':
                                node = new AdditionNodeModel('Addition ' + (nodesCount + 1), 'rgb(0,0,255)');
                                node.addOutPort('Result');
                                node.addInPort('In');
                                break;
                            case 'mult':
                                node = new MultiplicationNodeModel('Multiplication ' + (nodesCount + 1), 'rgb(0,40,255)');
                                node.addOutPort('Result');
                                node.addInPort('In');
                                break;
                            case 'div':
                                node = new DivisionNodeModel('Division ' + (nodesCount + 1), 'rgb(0,80,255)');
                                node.addOutPort('Result');
                                node.addInPort('A');
                                node.addInPort('B');
                                break;
                            case 'sub':
                                node = new SubtractionNodeModel('Subtraction ' + (nodesCount + 1), 'rgb(0,160,255)');
                                node.addOutPort('Result');
                                node.addInPort('A');
                                node.addInPort('B');
                                break;
                        }

                        if (!node) { return }

                        const point = app.getDiagramEngine().getRelativeMousePoint(event);
                        node.setPosition(point);
                        app.getDiagramEngine().getModel().addNode(node);
                        forceUpdate()
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                    }}
                >
                    <DemoCanvasWidget>
                        <CanvasWidget engine={app.getDiagramEngine()} />
                    </DemoCanvasWidget>
                </S.Layer>
            </S.Content>
        </S.Body>
    );
}