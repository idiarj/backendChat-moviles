import {promises as fs} from 'fs';

export class FsUtils {
    static async readJsonFile(filePath) {
        try {
            console.log(filePath)
            const data = await fs.readFile(filePath);
            //console.log(data)
            return JSON.parse(data);
        } catch (error) {
            console.log('Error al leer el json:', error);
        }
    }
}