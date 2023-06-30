import {BaseNode} from "../base/BaseNode";

export class SubtractionNodeModel extends BaseNode {
    constructor(options: any, color: string) {
        super(options, color);
        this.options.type = 'subtraction'
    }

    processParentValues(values: any[]): any {
        return values.reduce((a, b) => a - b, 0)
    }
}