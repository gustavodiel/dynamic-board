import {
    DefaultLinkFactory,
    DefaultLinkModel,
    DefaultLinkWidget, DefaultPortFactory,
    DefaultPortModel, DeserializeEvent, LinkWidget,
    PointModel
} from "@projectstorm/react-diagrams";
import {BaseNode} from "./base/BaseNode";
import {AbstractModelFactory} from "@projectstorm/react-canvas-core";
import {DefaultPortModelOptions} from "@projectstorm/react-diagrams-defaults/dist/@types/port/DefaultPortModel";


export class ValueLinkModel extends DefaultLinkModel {
    private value: any;

    constructor() {
        super({
            type: 'value'
        });

        this.value = null;
    }

    serialize(): any {
        return {
            ...super.serialize(),
            value: this.value
        };
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);

        console.log("Hey!")
        this.value = Number(event.data.value);
    }

    setValue(newValue: any) {
        this.value = Number(newValue)
    }

    getValue() { return this.value }

    update(otherNode: BaseNode) {
        this.setValue(otherNode.getValue());

        const parent = this.targetPort?.getParent()

        if (!parent) { return }
        (parent as unknown as BaseNode).update()
    }

    getTargetNode(): ValueLinkModel {
        return this.targetPort!.getNode() as unknown as ValueLinkModel
    }

    getSourceNode() :ValueLinkModel {
        return this.sourcePort!.getNode() as unknown as ValueLinkModel
    }
}

export class ValuePortModel extends DefaultPortModel {
    constructor(options: DefaultPortModelOptions) {
        options.type = 'value'
        super(options);
    }
    // @ts-ignore
    createLinkModel(): ValueLinkModel | null {
        return new ValueLinkModel();
    }
}

export class ValuePortFactory extends DefaultPortFactory {
    constructor() {
        super()
        this.type = 'value';
    }

    // @ts-ignore
    generateModel(): ValuePortModel {
        return new ValuePortModel({ name: 'port' })
    }
}

export class ValueLinkFactory extends DefaultLinkFactory {
    constructor() {
        super('value');
    }

    generateModel(): ValueLinkModel {
        return new ValueLinkModel();
    }

    generateReactWidget(event: { model: DefaultLinkModel; }): JSX.Element {
        return <ValueLinkWidget link={event.model} diagramEngine={this.engine} />;
    }
}

const CustomLinkArrowWidget = (props: { color?: any; point?: any; previousPoint?: any; colorSelected?: string }) => {
    const { point, previousPoint } = props;

    const angle =
        90 +
        (Math.atan2(
                point.getPosition().y - previousPoint.getPosition().y,
                point.getPosition().x - previousPoint.getPosition().x
            ) *
            180) /
        Math.PI;

    //translate(50, -10),
    return (
        <g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
            <g style={{ transform: 'rotate(' + angle + 'deg)' }}>
                <g transform={'translate(0, -3)'}>
                    <polygon
                        points="0,10 8,30 -8,30"
                        fill={props.color}
                        data-id={point.getID()}
                        data-linkid={point.getLink().getID()}
                    />
                </g>
            </g>
        </g>
    );
};

export class ValueLinkWidget extends DefaultLinkWidget {
    generateArrow(point: PointModel, previousPoint: PointModel): JSX.Element {
        return (
            <CustomLinkArrowWidget
                key={point.getID()}
                point={point as any}
                previousPoint={previousPoint as any}
                colorSelected={this.props.link.getOptions().selectedColor}
                color={this.props.link.getOptions().color}
            />
        );
    }

    render() {
        //ensure id is present for all points on the path
        const points = this.props.link.getPoints();
        let paths = [];
        this.refPaths = [];

        //draw the multiple anchors and complex line instead
        for (let j = 0; j < points.length - 1; j++) {
            paths.push(
                this.generateLink(
                    LinkWidget.generateLinePath(points[j], points[j + 1]),
                    {
                        'data-linkid': this.props.link.getID(),
                        'data-point': j,
                        onMouseDown: (event: MouseEvent) => {
                            // @ts-ignore
                            this.addPointToLink(event, j + 1);
                        }
                    },
                    j
                )
            );
        }

        //render the circles
        for (let i = 1; i < points.length - 1; i++) {
            paths.push(this.generatePoint(points[i]));
        }

        if (this.props.link.getTargetPort() !== null) {
            paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
        } else {
            paths.push(this.generatePoint(points[points.length - 1]));
        }

        return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
    }
}