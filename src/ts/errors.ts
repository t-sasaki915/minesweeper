export class IllegalArgumentError extends Error {

    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, IllegalArgumentError.prototype);
    }

}

export class IllegalStateError extends Error {

    constructor(msg: string) {
        super(msg);

        Object.setPrototypeOf(this, IllegalStateError.prototype);
    }

}
