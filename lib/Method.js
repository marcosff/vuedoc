"use strict"

class Method {
    constructor(textArray, params = {}) {
        this.textArray = textArray
        this.params = params
    }
    async init() {
        // console.log("Method init")
        // console.log(this.textArray)
        return {type: 'method', assync: true, description: "algo simpático"}
    }
}

module.exports = Method