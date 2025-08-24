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

//type TrippingCharacteristic = "B" | "C" | "D" | undefined;
type TrippingCharacteristic = "B" | "C" | "D";

class CMiniatureCircuitBreaker {
  companyID: number;
  group: number;
  podgroup: number;
  code: string;
  name: string;
  poles: number;
  hasN: boolean;
  type: TrippingCharacteristic;
  Inom: number;
  RatedShortCircuitCapacity: number | undefined;

  constructor(
    companyID: number,
    group: number,
    podgroup: number,
    code: string,
    name: string,
    poles: number,
    hasN: boolean,
    type: TrippingCharacteristic,
    Inom: number,
    RatedShortCircuitCapacity: number | undefined,
  ) {
    this.companyID = companyID;
    this.group = group;
    this.podgroup = podgroup;
    this.code = code;
    this.name = name;
    this.poles = poles;
    this.hasN = hasN;
    this.type = type;
    this.Inom = Inom;
    this.RatedShortCircuitCapacity = RatedShortCircuitCapacity;
  }

}

class CMiniatureCircuitBreakerAccessorie {
  companyID: number;
  group: number;
  podgroup: number;
  code: string;
  name: string;

  constructor(
    companyID: number,
    group: number,
    podgroup: number,
    code: string,
    name: string,
  ) {
    this.companyID = companyID;
    this.group = group;
    this.podgroup = podgroup;
    this.code = code;
    this.name = name;
  }
}

const parseRatedShortCircuitCapacity = (strRatedShortCircuitCapacity: string): number | undefined => {
  //console.log(strRatedShortCircuitCapacity);
  if ((strRatedShortCircuitCapacity?.startsWith("(") && (strRatedShortCircuitCapacity?.endsWith(")")))) {
    return Number.parseFloat(strRatedShortCircuitCapacity.replace("(", ""));
  } else return undefined;
}

type TPolesPlusN = {
  poles: number;
  hasN: boolean;
}

const parsePoles = (strPolesPlusN: string): TPolesPlusN => {
  return {
    poles: 0,
    hasN: false,
  }
}

function isTrippingCharacteristic(value: string | undefined): value is TrippingCharacteristic {
  const validCharacteristics: TrippingCharacteristic[] = ['B', 'C', 'D'];
  return typeof value === 'string' && validCharacteristics.includes(value as TrippingCharacteristic);
}

export const initImportETI = () => {
  const excel = new Excel(pathToETIPrice);
  const price = new ETIPrice(excel);
  if (Array.isArray(price?.main)) {
    const mainPriceList: ETIPriceElement[] = [];
    const miniatureCircuitBreakersPriceList: CMiniatureCircuitBreaker[] = [];
    const miniatureCircuitBreakersAccessoriePriceList: CMiniatureCircuitBreakerAccessorie[] = [];
    
    let currentGroup = 0;
    let current1Podgroup = 0;
    for(const row of price.main) {
      if (!row[numberToLetter(1)]) {
        const splittedFirstCell = (row[numberToLetter(0)]?.split(" "));
        if (Array.isArray(splittedFirstCell)) {
          const groupName = splittedFirstCell?.slice(1).join(" ");
          const groupIDArray = splittedFirstCell[0]?.split(".");
          if (Array.isArray(groupIDArray)) {
            currentGroup = !Number.isNaN(Number.parseInt(groupIDArray[0])) ? Number.parseInt(groupIDArray[0]) : 0;
            current1Podgroup = !Number.isNaN(Number.parseInt(groupIDArray[1])) ? Number.parseInt(groupIDArray[1]) : 0;
            //console.log(`${currentGroup}.${current1Podgroup} ${groupName}`)
            //console.log(`${currentGroup} ${current1Podgroup}`);
          }
        }
      } else {
        if ((currentGroup !== 0) && (current1Podgroup !== 0)) {
          const element = new ETIPriceElement(currentGroup, current1Podgroup, row[numberToLetter(0)], row[numberToLetter(1)], row[numberToLetter(6)]);
          mainPriceList.push(element);
          // Автоматичні вимикачі та аксесуари до них
          if (currentGroup === 1) {
            const elementStrArr = element.name.split(" ");
            if (`${elementStrArr[0]} ${elementStrArr[1]}` === 'Авт. вимикач') {
              const startIndex = (elementStrArr[2] === "ETIMAT") ? 4 : 3;
              //const trippingCharacteristic = ((elementStrArr[startIndex + 1] === "B") || (elementStrArr[startIndex + 1] === "C") || (elementStrArr[startIndex + 1] === "D")) ? elementStrArr[startIndex + 1] : undefined; 
              if (isTrippingCharacteristic(elementStrArr[startIndex + 1])) {
                miniatureCircuitBreakersPriceList.push(new CMiniatureCircuitBreaker(
                  1,
                  currentGroup,
                  current1Podgroup,
                  element.code,
                  element.name,
                  Number.parseInt(elementStrArr[startIndex]), 
                  false,
                  elementStrArr[startIndex + 1], 
                  Number.parseInt(elementStrArr[startIndex + 2]),
                  parseRatedShortCircuitCapacity(elementStrArr[startIndex + 3]))
                );
                console.table(elementStrArr);
              }
            } else {
              miniatureCircuitBreakersAccessoriePriceList.push(new CMiniatureCircuitBreakerAccessorie(
                1,
                currentGroup,
                current1Podgroup,
                element.code,
                element.name,
              ));
            }
          }
        }
      }
      //    console.log(row[numberToLetter(0)]);
    }
      //console.log(mainPriceList);
    //console.log(miniatureCircuitBreakersPriceList);
    //console.log(miniatureCircuitBreakersAccessoriePriceList);


    // console.group(mainPriceList);
    // console.log(numberToLetter(0)) 
    // console.log(result?.main[15][numberToLetter(1)]) 
    // console.log(result?.main[numberToLetter(1)]) 
  } else {
    throw new Error('jhgjgjh');
  } 
}

