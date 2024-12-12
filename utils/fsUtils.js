import { promises as fs } from 'fs';

export class FsUtils {
    static async readJsonFile(filePath) {
        try {
 
            const data = await fs.readFile(filePath);
            return JSON.parse(data);
        } catch (error) {
            console.log('Error al leer el json:', error);
        }
    }

    static async writeFile(filePath, data) {
        try {
            await fs.writeFile(filePath, data);
        } catch (error) {
            console.log('Error al escribir el archivo:', error);
        }
    }

    static async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
            console.log(`Archvivo ${filePath} borrado`);
        } catch (error) {
            console.log('Error al borrar el archivo:', error);
        }
    }
}