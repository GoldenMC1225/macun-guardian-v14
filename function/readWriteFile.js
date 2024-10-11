const fs = require('node:fs').promises;

// Function to read a JSON file asynchronously
async function readFile(filePath) {
    try {
        const fileData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        return null;
    }
}

// Function to write to a JSON file asynchronously
async function writeFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing file: ${error}`);
    }
}

// Function to create a new entry in the JSON file asynchronously
async function createEntry(filePath, newEntry) {
    const data = await readFile(filePath);
    if (data) {
        data.push(newEntry);
        await writeFile(filePath, data);
    }
}

// Function to update an existing entry in the JSON file asynchronously
async function updateEntry(filePath, updatedEntry, id) {
    const data = await readFile(filePath);
    if (data) {
        const index = data.findIndex(entry => entry.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedEntry };
            await writeFile(filePath, data);
        } else {
            console.error(`Entry with id ${id} not found`);
        }
    }
}

// Function to delete an entry from the JSON file asynchronously
async function deleteEntry(filePath, id) {
    const data = await readFile(filePath);
    if (data) {
        const index = data.findIndex(entry => entry.id === id);
        if (index !== -1) {
            data.splice(index, 1);
            await writeFile(filePath, data);
        } else {
            console.error(`Entry with id ${id} not found`);
        }
    }
}

// Function to check if an entry exists in the JSON file asynchronously
async function checkEntry(filePath, id) {
    const data = await readFile(filePath);
    if (data) {
        const entry = data.find(entry => entry.id === id);
        return entry !== undefined;
    }
    return false;
}

module.exports = {
    readFile,
    writeFile,
    createEntry,
    updateEntry,
    deleteEntry,
    checkEntry,
};