const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Form = require('../models/formModel');

dotenv.config({ path: path.resolve('config.env') });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const readFiles = async (directoryPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }

            resolve(files);
        });
    });
}

const isFileAssociatedWithModel = async (filename) => {
    const form = await Form.findOne({
        $or: [
            { 'mainIncome.income': { $elemMatch: { 'file.uri': `public/files/${filename}` } }},
            { 'extraIncome': { $elemMatch: { 'income': { $elemMatch: { 'file.uri': `public/files/${filename}` } } } }},
            { 'extraIncome': { $elemMatch: { 'file.uri': `public/files/${filename}` } }},
        ]
    });

    return !!form;
}

const deleteUnassociatedFiles = async () => {
    const directoryPath = path.resolve('public/files');
    const files = await readFiles(directoryPath);

    for (const file of files) {
        const isAssociated = await isFileAssociatedWithModel(file);

        if (!isAssociated) {
            fs.unlink(path.join(directoryPath, file), error => {
                if (error) {
                    console.error('Failed to delete file:', file, error);
                } else {
                    console.log('Deleted file:', file);
                }
            });
        }
    }
}

module.exports = deleteUnassociatedFiles;
