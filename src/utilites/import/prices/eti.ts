import { app_conf } from '@/conf/app';
import excelToJson from 'convert-excel-to-json';

const pathToETIPrice = app_conf.prices.import.eti;

type TExcelSheet = {
    excelSheetName: string,
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

//const getHeadersPositions = (excelBookObj: object, excelBookObj: {key:string}) => {

///}

const getFormattedExcelBookObj = (excelBookObj: object) => {
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

  //const headerPodition = getHeadersPositions(excelBookObj, excelBookObj);

  return etiPrice;
};

const getPriceSheets = (exBookObj: object) => {
  return Object.keys(exBookObj)
}

const getExcelBookObj =  (path: string) => {
  return excelToJson({
    sourceFile: path
  });
}

const getMainPriceHeader = () => {

}