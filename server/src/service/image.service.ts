import { join } from "path";
import * as fs from "fs";


export const getAllFilesFromFolder = (folderPath: string) => {
    console.log(folderPath);
    let images: Array<string> = [];
    fs.readdirSync(folderPath).forEach(file => {
        images.push(file);
    });
    return images;
}