import excelToJson from 'convert-excel-to-json';  
import { StringKeyedObject } from '../../../types/universal';

export class Excel {
  excelBook: StringKeyedObject;
  constructor(pathToETIPrice: string) {
    const excelBookObj = excelToJson({
      sourceFile: pathToETIPrice
    });
    if (!excelBookObj) throw new Error('File with prices is incorrect!');
    this.excelBook = excelBookObj;
  }

  getSheetsNames(): string[] {
    return Object.keys(this.excelBook);
  }
}


