const fs = require('fs');
const readline = require('readline');

console.log(process.argv[2]);
temp = './test/test.txt'

const testFolder = process.argv[2];

fs.exists(process.argv[2], (exists) => {
    if (exists) {
        openFolder(process.argv[2])
    } else {
        console.log("caminho não encontrado")
    }
});


function openFolder(folder) {
    if (fs.lstatSync(testFolder).isDirectory())
    {
        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => {
                searchBlock(file);
            });
        });
    } else {
        console.log("não é um diretorio")
    }
}


function searchBlock(file) {
    const readInterface = readline.createInterface({
        input: fs.createReadStream(testFolder+file),
    });
    let i = 0
    let info = []
    let copy = false
    readInterface.on('line', function(line) {
        if (line.includes('/**')) {
            copy = true
        }
        if (copy == true) {
            info.push(line)
        } else {
            info = []
        }
        if (line.includes('*/')) {
            copy = false
            console.log(info)
        }
    });

}
