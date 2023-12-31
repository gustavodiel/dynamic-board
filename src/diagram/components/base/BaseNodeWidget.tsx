import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';
import {DefaultPortLabel, DefaultPortModel} from "@projectstorm/react-diagrams";
import {BaseNode} from "./BaseNode";
import {Application} from "../../Application";

export const Node = styled.div<{ background: string; selected: boolean }>`
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

export const ValueLabel = styled.div`
  flex-grow: 1;
  padding: 5px 5px;
`;

export const Ports = styled.div`
  display: flex;
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

export interface DefaultNodeProps {
    node: BaseNode;
    engine: DiagramEngine;
    app: Application;
}

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
    export class BaseNodeWidget extends React.Component<DefaultNodeProps> {
    generatePort = (port: DefaultPortModel) => {
        return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
    };

    componentDidMount() {
        this.props.app.addListener(this)
    }

    render() {
        return (
            <Node
                data-default-node-name={this.props.node.getOptions().name}
                selected={this.props.node.isSelected()}
                background={this.props.node.getOptions().color!}
            >
                <Title>
                    <TitleName defaultValue={this.props.node.getOptions().name} type="text" />
                </Title>
                <Ports>
                    <ValueLabel>{this.props.node.getValue()}</ValueLabel>
                </Ports>
                <Ports>
                    <PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</PortsContainer>
                    <PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</PortsContainer>
                </Ports>
            </Node>
        );
    }
}