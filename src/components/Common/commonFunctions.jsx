// commonFunctions.jsx
import moment from "moment";
import configParam from "config";

export function calcFormula(exp) {
  try {
    const sanitizedExpression = sanitizeExpression(exp); 
    return evaluateExpression(sanitizedExpression);
  } catch (error) {
    return 0;
  }
}

const sanitizeExpression = (expression) => {
  // Remove any spaces
  return expression.toString().replaceAll(/\s/g, '');
}

const evaluateExpression = (expression) => {
  const numbers = [];
  const operators = [];
  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === '(') {
      operators.push(char);
    } else if (char === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        performOperation(numbers, operators);
      }
      operators.pop(); // Discard '('
    } else if (isOperator(char)) {
      while (
        operators.length > 0 &&
        shouldPerformOperation(char, operators[operators.length - 1])
      ) {
        performOperation(numbers, operators);
      }
      operators.push(char);
    } else {
      currentNumber += char;

      if (
        i === expression.length - 1 ||
        isOperator(expression[i + 1]) ||
        expression[i + 1] === '(' ||
        expression[i + 1] === ')'
      ) {
        numbers.push(parseFloat(currentNumber));
        currentNumber = '';
      }
    }
  }

  while (operators.length > 0) {
    performOperation(numbers, operators);
  }

  return numbers[0];
}

const isOperator = (char) => {
  return ['+', '-', '*', '/'].includes(char);
}

const shouldPerformOperation = (op1, op2) => {
  if (op2 === '(' || op2 === ')') return false;
  if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-')) return false;
  return true;
}

const performOperation = (numbers, operators) => {
  const operator = operators.pop();
  const number2 = numbers.pop();
  const number1 = numbers.pop();

  switch (operator) {
    case '+':
      numbers.push(number1 + number2);
      break;
    case '-':
      numbers.push(number1 - number2);
      break;
    case '*':
      numbers.push(number1 * number2);
      break;
    case '/':
      numbers.push(number1 / number2);
      break;
    default:
      break;
  }
}

export const setRange = (btGroupValue, headPlant,customdatesval)=>{
  let startrange;
  let endrange;
  try {
      if (Number(btGroupValue) === 7) {
          startrange = moment(moment().subtract(1, 'day')).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
          endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
      }
      else if (Number(btGroupValue) === 17) {
          startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
          endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
      } else if (Number(btGroupValue) === 20) {
          startrange = configParam.DATE_ARR(btGroupValue, headPlant)
          endrange = configParam.DATE_ARR(22, headPlant)
      } else if (Number(btGroupValue) === 21) {
          startrange = configParam.DATE_ARR(btGroupValue, headPlant)
          endrange = configParam.DATE_ARR(23, headPlant)
      } else if (Number(btGroupValue) === 16) {
          startrange = moment(moment().subtract(1, 'month')).startOf('month').format("YYYY-MM-DDTHH:mm:ssZ")
          endrange = moment(moment().subtract(1, 'month')).endOf('month').format("YYYY-MM-DDTHH:mm:ssZ")
      } else if (Number(btGroupValue) === 30) {
          startrange = moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ssZ")
          endrange =   moment().format('YYYY-MM-DDTHH:mm:ssZ')
      } else if (Number(btGroupValue) === 60){
          startrange = moment().subtract(60, 'day').format("YYYY-MM-DDTHH:mm:ssZ");
          endrange =   moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ssZ");
      }
      else {
          let shiftStart = configParam.DATE_ARR(btGroupValue, headPlant)

          if (shiftStart !== undefined) {
              startrange = shiftStart
          }
          else {
              startrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
          }
          endrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
      }
      return [startrange, endrange, null]
  } catch (err) {
      console.log("Error at getRange", err)
      return [startrange, endrange, err]
  }

}


  // ... Add more common functions as needed
