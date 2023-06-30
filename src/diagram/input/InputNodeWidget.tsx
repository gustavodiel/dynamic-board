import * as React from 'react';
import * as _ from 'lodash';
import { InputNodeModel } from './InputNodeModel';
import {DefaultPortLabel, DefaultPortModel,
    DiagramEngine,
} from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import {useEffect, useState} from "react";
import {Application} from "../Application";

export interface InputNodeWidgetProps {
    node: InputNodeModel;
    engine: DiagramEngine;
    app: Application;
    size?: number;
}

namespace S {
    export const Node = styled.div<{ background: any, selected: boolean }>`
      background-color: ${(p) => p.background};
      border-radius: 5px;
      font-family: sans-serif;
      color: white;
      border: solid 2px black;
      overflow: visible;
      font-size: 11px;
      border: solid 2px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'black')};
    `;
    export const Title = styled.div`
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      white-space: nowrap;
      justify-items: center;
    `;

    export const TitleName = styled.input`
      flex-grow: 1;
      padding: 5px 5px;
    `;

    export const Ports = styled.div`
      display: flex;
      background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
    `;

    export const Input = styled.div`
      display: flex;
      padding: 0.5em;
      background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
    `;

    export const PortsContainer = styled.div`
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      &:first-of-type {
        margin-right: 10px;
      }

      &:only-child {
        margin-right: 0px;
      }
    `;
}

export const InputNodeWidget = ({engine, node, app, size}: InputNodeWidgetProps) => {
    const generatePort = (port: DefaultPortModel) => {
        return <DefaultPortLabel engine={engine} port={port} key={port.getID()} />;
    };

    const setValue = (newVal: number) => {
        node.setValue(newVal)
        app.onUpdate(node)
    }

    return (
        <S.Node
            data-default-node-name={node.getOptions().name}
            selected={node.isSelected()}
            background={node.getOptions().color}
        >
            <S.Title>
                <S.TitleName defaultValue={node.getOptions().name} type="text" />
            </S.Title>
            <S.Input>
                <input type="number" defaultValue={node.getValue()} onChange={e => setValue(Number(e.target.value))}/>
            </S.Input>
            <S.Ports>
                <S.PortsContainer>{_.map(node.getInPorts(), generatePort)}</S.PortsContainer>
                <S.PortsContainer>{_.map(node.getOutPorts(), generatePort)}</S.PortsContainer>
            </S.Ports>
        </S.Node>
    );
}
