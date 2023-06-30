import {BaseNode} from "../base/BaseNode";

export class MultiplicationNodeModel extends BaseNode {
    constructor(options: any, color: string) {
        super(options, color);
        this.options.type = 'multiplication'
    }

    processParentValues(values: any[]): any {
        return values.reduce((a, b) => Number(a) * Number(b), 1)
    }
}