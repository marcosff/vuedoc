"use strict"

const Method = require("../lib/Method")
const { once } = require('events');

// const { read } = require("fs");

class ReadFiles {
    constructor(folder) {
        this.readline = undefined
        this.fs = undefined
        this.folder = folder
        this.data = {}
    }
    async init(fs, readline) {
        this.readline = readline
        this.fs = fs
        let tempData = {}
        fs.exists(process.argv[2], async (exists) => {
            if (exists) {
                console.log(tempData)
                tempData = await this.openFolder(process.argv[2])
                console.log(6)
                console.log(tempData)
            } else {
                console.log("caminho não encontrado")
            }
        });
    }
    async openFolder() {
        let tempData = {}
        if (this.fs.lstatSync(this.folder).isDirectory()) {
            let files = this.fs.readdirSync(this.folder) 
            await files.forEach(async (file) => {
                console.log(file)
                tempData[file.replace(/ /g, "_")] = []
                console.log(0)
                let teste = await this.searchBlock(file);
                tempData[file.replace(/ /g, "_")] = teste 
                console.log(5)
                console.log(tempData)
            });

            // ESSE RETURN NAO ESTÁ OCORRENDO DEPOIS DOS AWAITs... ELE OCORRE ANTES
            return tempData
        } else {
            console.log("não é um diretorio")
        }
    }
    async searchBlock(file) {        
        console.log(1)
        let tempData = []
        
        let i = 0
        let info = []
        let copy = false
        const rl = this.readline.createInterface({
            input: this.fs.createReadStream(this.folder + file),
            crlfDelay: Infinity
        });
        console.log(2)
        rl.on('line', (line) => {
        //for await (const line of rl) {
            if (line.includes('/**')) {
                copy = true
                info.push(line)
            }
            if (copy == true) {
                if (line.trim().startsWith('*')) {
                    info.push(line)
                }
            } else {
                info = []
            }
            if (line.includes('*/')) {
                copy = false
                tempData.push({'info': info, 'file': file})
                console.log(3)
                // this.validateBlock(info, file)
            }
        })
        await once(rl, 'close');

        console.log(4)
        console.log(tempData)
        return(tempData)

    };
    validateBlock(info, file) {
        return new Promise(result => {
            let blockType = ""
            info.forEach(element => {
                switch (true) {
                    case element.includes("@method"):
                        // console.log("this is a method, call lib method")
                        let method = new Method(info)
                        if (this.data[file.replace(/ /g, "_")].method == undefined) {
                            this.data[file.replace(/ /g, "_")].method = []
                        }
                        this.data[file.replace(/ /g, "_")].method.push(method.init())
                        blockType = "method"
                        break;
                    case element.includes("@beforeCreate"):
                        // console.log("this is a beforeCreate, call lib beforeCreate")
                        blockType = "beforeCreate"
                        break;
                    case element.includes("@created"):
                        // console.log("this is a created, call lib created")
                        blockType = "created"
                        break;
                    case element.includes("@beforeMount"):
                        // console.log("this is a beforeMount, call lib beforeMount")
                        blockType = "beforeMount"
                        break;
                    case element.includes("@mounted"):
                        // console.log("this is a mounted, call lib mounted")
                        blockType = "mounted"
                        break;
                    case element.includes("@beforeUpdate"):
                        // console.log("this is a beforeUpdate, call lib beforeUpdate")
                        blockType = "beforeUpdate"
                        break;
                    case element.includes("@updated"):
                        // console.log("this is a updated, call lib updated")
                        blockType = "updated"
                        break;
                    case element.includes("@beforeDetroy"):
                        // console.log("this is a beforeDetroy, call lib beforeDetroy")
                        blockType = "beforeDetroy"
                        break;
                    case element.includes("@destroyed"):
                        // console.log("this is a destroyed, call lib destroyed")
                        blockType = "destroyed"
                        break;
                    case element.includes("@sockets"):
                        // console.log("this is a sockets, call lib sockets")
                        blockType = "sockets"
                        break;
    
                    default:
                        break;
                }
    
            });
            if (blockType == "") {
                // console.log("this is the main info, call lib module")
                this.data[file.replace(/ /g, "_")].main = {type: 'element', assync: true, description: "outra coisa qualquer"}
            }
            //console.log(this.data)
            result(true)

        })
    }
}
module.exports = ReadFiles