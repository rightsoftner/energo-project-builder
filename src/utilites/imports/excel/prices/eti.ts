import { app_conf } from '../../../../conf/app';
import { Excel } from '../excel';
import { StringKeyedObject } from '../../../../types/universal';
import { getFastDeepObjectCopy,
  cleanString,
  numberToLetter,
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
    if (!this.main || !this.orders || !this.newPositions || !this.removedFromProduction) throw new Error('ETI Price file is wrong or has changed format.');
  }
}

class ETIPriceElementsGroup {
  group: number;
  podgroup: number;
  name: string;

  constructor(group: number, podgroup: number, name: string) {
    this.group = group;
    this.podgroup = podgroup;
    this.name = name;
  }
}

class ETIPriceElement {
  group: number;
  podgroup: number;
  code: string;
  name: string;
  price: number | null;

  constructor(group: number, podgroup: number, code: string, name: string, price: number | null) {
    this.group = group;
    this.podgroup = podgroup;
    this.code = code;
    this.name = name;
    this.price = price;

  }
}

export const importETI = () => {
  //const result = importExcel(pathToETIPrice);
  const excel = new Excel(pathToETIPrice);
  const result = new ETIPrice(excel);
  //const result = excel.getSheetsNames();
//  console.log(result?.main?.[4]?.['A'])
if (Array.isArray(result?.main)) {
  const mainPriceList: ETIPriceElement[] = [];
  let currentGroup = 0;
  let currentPodgroup = 0;
  for(const row of result.main) {
    if (!row[numberToLetter(1)]) {

    } else {

    }
    mainPriceList.push(new ETIPriceElement(0, 0, row[numberToLetter(0)], row[numberToLetter(1)], row[numberToLetter(6)]))
//    console.log(row[numberToLetter(0)]);
  }
  console.group(mainPriceList);
  console.log(numberToLetter(0)) 
  console.log(result?.main[15][numberToLetter(1)]) 
  console.log(result?.main[numberToLetter(1)]) 
} else {
  throw new Error('jhgjgjh');
} 
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

