#!/usr/bin/env node
// DEPENDENCIES
const chalk = require('chalk');
const fs = require('fs');
const util = require('util');
const filesToDelete = [`${process.cwd()}/src/logo.svg`, `${process.cwd()}/src/index.css`, `${process.cwd()}/src/App.css`];

console.log(chalk.green('🧹 Cleaning up Create React App...\n'));

console.log(chalk.red('Deleting files...'));
const deleteFile = filePath => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

filesToDelete.map(file => {
    deleteFile(file);
    console.log(chalk.red(`- ${file}`));
});

console.log(chalk.yellow('\nRefactoring Files...'));

const readFile = async (filePath, callback = () => {}) => {
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', callback);
    } else {
        callback(null);
    }
}

const writeFile = async (filePath, content, callback = () => {}) => {
    fs.writeFile(filePath, content, (err) => {
        if (err) throw Error('Could not create App.js');
    
        callback(true);
    }); 
}

console.log(chalk.yellow('\nsrc/App.js...'));
readFile(`${process.cwd()}/src/App.js`, async (error, content) => {
    const removeLines = ['import logo from \'./logo.svg\';', 'import \'./App.css\';', '        <img src={logo} className="App-logo" alt="logo" />',];
    const replaceLine = ['function App() {', 'const App = () => {'];

    if (error) throw Error('Could not read App.js');
    
    let file = content.split('\n');
    file = await file.filter(line => removeLines.indexOf(line) < 0);
    await removeLines.map(line => console.log(chalk.red(`- ${line}`)));
    file = await file.map(line => {
        if (line === replaceLine[0]) {
            return replaceLine[1];
        }
        return line;
    });
    console.log(chalk.red(`<=> ${replaceLine[1]}`));

    writeFile(`${process.cwd()}/src/App.js`, file.join('\n'));

    fs.mkdirSync(`${process.cwd()}/src/components`);

    fs.rename(`${process.cwd()}/src/App.js`, `${process.cwd()}/src/components/App.js`, (error) => {
        if (error) throw Error('Could not move App.js');
        console.log(chalk.magenta(`\n/src/App.js -> /src/components/App.js`));

        console.log(chalk.yellow('\nsrc/index.js...'));
    
        readFile(`${process.cwd()}/src/index.js`, async (error, content) => {
            const removeLines = ['import \'./index.css\';'];
            const replaceLine = ['import App from \'./App\';', 'import App from \'./components/App\';'];
    
            if (error) throw Error('Could not read index.js');
    
            let file = content.split('\n');
            file = await file.filter(line => removeLines.indexOf(line) < 0);
            file = await file.map(line => {
                if (line === replaceLine[0]) {
                    return replaceLine[1];
                }
                return line;
            });
            await removeLines.map(line => console.log(chalk.red(`- ${line}`)));
    
            writeFile(`${process.cwd()}/src/index.js`, file.join('\n'));
        });
    });
});


// if (fs.existsSync(`${process.cwd()}/src/App.js`)) {
    // const AppJs = readFile(`${process.cwd()}/src/App.js`).then(data => {
    //     console.log('RESULT');
    //     console.log(data);
    // });
    // console.log(AppJs);
// }

// console.log(process.cwd());