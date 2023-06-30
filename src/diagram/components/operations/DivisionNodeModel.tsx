import {BaseNode} from "../base/BaseNode";

export class DivisionNodeModel extends BaseNode {
    constructor(options: any, color: string) {
        super(options, color);
        this.options.type = 'division'
    }

    processParentValues(values: any[]): any {
        return values.reduce((a, b) => b && b !== 0 ? a / b : 0, 0)
    }
}