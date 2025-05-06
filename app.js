const fs = require('fs')
const fsPromises = require('fs/promises')

// 1. Promise

fsPromises.writeFile('data.txt', 'Hello, World!')
    .then(() => fsPromises.readFile('data.txt', 'utf-8'))
    .then((data) => {
        console.log(data,"read content1")
        return fsPromises.appendFile('data.txt', ' - Appended Content')
    })
    .then(() => fsPromises.rename('data.txt', 'updatedData.txt'))
    .then(() => fsPromises.unlink('updatedData.txt'))

    // 2. async/await

const asyncFileOperation = async() => {
        await fsPromises.writeFile('data.txt', 'Hello, World!')
        const data = await fsPromises.readFile('data.txt', 'utf-8')
        console.log(data,"read content 2")
        await fsPromises.appendFile('data.txt', ' - Appended Content')
        await fsPromises.rename('data.txt', 'updatedData.txt')
        await fsPromises.unlink('updatedData.txt')
    } 
    
asyncFileOperation()

//3. new Promise()

function writeFilePromise(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function readFilePromise(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err,data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function appendFilePromise(file, data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data,err => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function renamePromise(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, err => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function unlinkPromise(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file, err => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

writeFilePromise('data.txt', 'Hello, World!')
    .then(() => readFilePromise('data.txt'))
    .then((data) => {
        console.log(data,"read content 3")
        return appendFilePromise('data.txt', ' - Appended Content')
    })
    .then(() => renamePromise('data.txt', 'updatedData.txt'))
    .then(() => unlinkPromise('updatedData.txt'))
