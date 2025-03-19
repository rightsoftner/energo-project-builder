import { app_conf } from '@/conf/app';
import excelToJson from 'convert-excel-to-json';

const pathToETIPrice = app_conf.prices.import.eti;

type TExcelSheet = {
  excelSheetName: string,
};

type ExcelBookObj = {
  [key: string]: any; // Adjust the value type as needed
};

class ETIPrice {
  main: TExcelSheet;
  orders: TExcelSheet;
  newPositions: TExcelSheet;
  removedFromProduction: TExcelSheet;
  constructor(mainName: string, ordersName: string, newPositionsName: string, removedFromProductionName: string) {
    this.main = {
      excelSheetName: mainName,
    };
    this.orders = {
      excelSheetName: ordersName,
    };
    this.newPositions = {
      excelSheetName: newPositionsName,
    };
    this.removedFromProduction = {
      excelSheetName: removedFromProductionName,
    };
  }
}

export const importETI = () => {
  const excelBookObj = getExcelBookObj(pathToETIPrice);
  if (!excelBookObj) throw new Error('File with prices is incorrect!');
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

}

type SheetNames = 'main' | 'orders' | 'newPositions' | 'removedFromProduction';
type TEqualSheetNames = Record<SheetNames, string>;

const isNonEmptyEqualSheetNames = (equalSheetNames: TEqualSheetNames): boolean => {
  for (const key in equalSheetNames) {
    if (equalSheetNames.hasOwnProperty(key) && typeof equalSheetNames[key as keyof TEqualSheetNames] === 'string' && equalSheetNames[key as keyof TEqualSheetNames].trim() === '') {
      return false;
    }
  }
  return true;
};

function cleanString(input: string): string {
  // Trim the string to remove leading and trailing whitespace
  let cleaned = input.trim();

  // Replace multiple spaces with a single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Remove newline characters
  cleaned = cleaned.replace(/\n/g, ' ');

  return cleaned;
}

const numberToLetter = (num: number): string => {
  // Ensure the number is within the valid range (0-25)
  if (num < 0 || num > 25) {
    throw new Error('Number out of range. Must be between 0 and 25.');
  }

  // Convert the number to the corresponding letter
  const letter = String.fromCharCode(65 + num);
  return letter;
}

const getHeadersPositions = (excelBookObj: ExcelBookObj, equalSheetNames: TEqualSheetNames): string | null => {
  const headerEtalonNames = new Set([
    'Код',
    'Повне найменування',
    'Ціна в Євро з ПДВ',
    'Ціна в грн. з ПДВ',
    'Знижка',
    'Вхідна ціна',
    'Вхідна ціна без ПДВ',
    'Склад',
  ]);

  if (!Object.hasOwn(excelBookObj, equalSheetNames.main)) throw new Error(`Excel book don't have sheet with name: ${equalSheetNames.main}`);
  //get rows names
  for (const key in excelBookObj[equalSheetNames.main]) {
    const columns = Object.keys(excelBookObj[equalSheetNames.main][key]);
    //let headerRow = '';
    let headerRow: string = '';
    console.log(key);
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['A'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['B'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['C'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['D'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['E'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['F'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['G'])));
    // console.log(headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][4]['H'])));
    //console.log(excelBookObj[equalSheetNames.main][key]['A']);
    //cleanString(numberToLetter(Number.parseInt(cell)

    //for (const cell in Object.keys(excelBookObj[equalSheetNames.main][key])) {
    for (const cell in excelBookObj[equalSheetNames.main][key]) {
        //console.log(numberToLetter(Number.parseInt(cell)));
      //--console.log(excelBookObj[equalSheetNames.main][key][numberToLetter(Number.parseInt(cell))]);
      //console.log(cell);
      //console.log(typeof cell);
      //console.log(excelBookObj[equalSheetNames.main][key][Number.parseInt(cell)]);
      //console.log(excelBookObj[equalSheetNames.main][key][Number.parseInt(cell)]);
      //  if (cell) {
      //console.log(cleanString(excelBookObj[equalSheetNames.main][key][cell]));

      //}
      //console.log(cell);
      //console.log(excelBookObj[equalSheetNames.main][key][cell]);
      //console.log(cleanString(excelBookObj[equalSheetNames.main][key][cell]));
      //if(!headerEtalonNames.has(cleanString(numberToLetter(Number.parseInt(cell))))) {
      
      if (!headerEtalonNames.has(cleanString(excelBookObj[equalSheetNames.main][key][cell]))) {
        headerRow = '';
        break;
      } else {
        headerRow = key;
      }
    }
    return headerRow;
  }
  console.log('1-----------');
  return null;
}

const getFormattedExcelBookObj = (excelBookObj: ExcelBookObj) => {
  const sheetsNames = getPriceSheets(excelBookObj);
  const equalSheetNames = {
    main: '',
    orders: '',
    newPositions: '',
    removedFromProduction: '',
  };
  for (const name of sheetsNames) {
    if (name.startsWith('Price_')) equalSheetNames.main = name;
    if (name.startsWith('Замовлення ETI')) equalSheetNames.orders = name;
    if (name.startsWith('Нові позиції')) equalSheetNames.newPositions = name;
    if (name.startsWith('Знято з виробництва')) equalSheetNames.removedFromProduction = name;
  }

  if (!isNonEmptyEqualSheetNames(equalSheetNames)) throw new Error('One or some sheets have unknown names.');

  const etiPrice = {
    main: {
      excelSheetName: equalSheetNames.main,

    },
    orders: {
      excelSheetName: equalSheetNames.orders,

    },
    newPositions: {
      excelSheetName: equalSheetNames.newPositions,

    },
    removedFromProduction: {
      excelSheetName: equalSheetNames.removedFromProduction,

    }
  }

  const headerPosition = getHeadersPositions(excelBookObj, equalSheetNames);
  console.log(headerPosition);
  return etiPrice;
};

const getPriceSheets = (exBookObj: object) => {
  return Object.keys(exBookObj)
}

const getExcelBookObj = (path: string) => {
  return excelToJson({
    sourceFile: path
  });
}

const getMainPriceHeader = () => {

}