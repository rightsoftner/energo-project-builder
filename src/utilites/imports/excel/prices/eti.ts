import { app_conf } from '../../../../conf/app';
import { Excel } from '../excel';
import { StringKeyedObject } from '../../../../types/universal';
import { getFastDeepObjectCopy,
  cleanString,
 } from '../../../../utilites/universal';

const pathToETIPrice = app_conf.prices.import.eti;

type TExcelSheet = {
  excelSheetName: string,
};

type ExcelBookObj = {
  [key: string]: any; // Adjust the value type as needed
};

type TEqualSheetNames = Record<SheetNames, string>;

type SheetNames = 'main' | 'orders' | 'newPositions' | 'removedFromProduction';


const isExcelHasValidETIStructure = (excel: Excel): boolean => {
  return true;
}


class ETIPrices {

}

class ETIPrice {
  main: StringKeyedObject | null;
  orders: StringKeyedObject | null;
  newPositions: StringKeyedObject | null;
  removedFromProduction: StringKeyedObject | null;

  constructor(excel: Excel) {
    this.main = null;
    this.orders = null;
    this.newPositions = null;
    this.removedFromProduction = null;
    const sheetsNames = excel.getSheetsNames().map(str => cleanString(str));
    for(const sheet of sheetsNames) {
      if (sheet.startsWith('Price_')) {
        this.main = getFastDeepObjectCopy(excel.excelBook[sheet]);
      }
      if (sheet.startsWith('Замовлення ETI')) {
        this.orders = getFastDeepObjectCopy(excel.excelBook[sheet]);
      }
      if (sheet.startsWith('Нові позиції')) {
        this.newPositions = getFastDeepObjectCopy(excel.excelBook[sheet]);
      }
      if (sheet.startsWith('Знято з виробництва')) {
        this.removedFromProduction = getFastDeepObjectCopy(excel.excelBook[sheet]);
      }
    }
  }
}

export const importETI = () => {
  //const result = importExcel(pathToETIPrice);
  const excel = new Excel(pathToETIPrice);
  const result = excel.getSheetsNames();
  console.log(result)
  /*
  //getFormattedExcelBookObj(excelBookObj)
  const FormattedExcelBookObj = getFormattedExcelBookObj(excelBookObj);
  //console.log(getFormattedExcelBookObj(excelBookObj));
//  console.log(Object.keys(excelBookObj[FormattedExcelBookObj.main.excelSheetName]['0']));
  //console.log(excelBookObj[FormattedExcelBookObj.main.excelSheetName][1]);
const mainSheet = excelBookObj[FormattedExcelBookObj.main.excelSheetName];
console.log(Object.keys(mainSheet[1]));

for (const row in mainSheet) {
  const arrColNames = Object.keys(row);
  console.log(arrColNames);
}

  // console.log(Object.keys(result));
  // console.log(Object.keys(result['Price_01.10.2024']));
  // console.log(typeof result['Price_01.10.2024'])
  // console.log(result['Price_01.10.2024']['7'])
  // result.map((row, index) => {
  // if (index < 10) {
  // console.log(row);
  // }
  // })
  // console.log(result);
*/
}

