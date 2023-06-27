const prompt2 = require('prompt-sync')({sigint: true});

const FIZZ_STR: string = "Fizz";
const BUZZ_STR: string = "Buzz";
const BANG_STR: string = "Bang";
const BONG_STR: string = "Bong";
const FEZZ_STR: string = "Fezz";
const EMPTY_STR: string = "";

// Running mode (DEFAULT / CUSTOM)
let mode: string;

// Map storing [number, string] entries added by user
let customRulesMap:Map<number, string> = new Map();

type Status = {
    divisible: boolean;
}

type Rules = {
    type3: boolean;
    type5: boolean;
    type13: boolean;
}

let rules:Rules = {type3:false, type5:false, type13:false};

// If given value is divisible by divisor, return str, otherwise return the empty string
// Set the status accordingly
function getString(value: number, divisor: number, str: string, status:Status): string {
    let message: string;
    if (value % divisor == 0) {
        message = str;
        status.divisible = true;
    } else {
        message = EMPTY_STR;
    }

    return message;
}

function fizzbuzz(endValue: number, rules:Rules): void {
    let fizz, buzz, bang, fezz, message: string;
    let status:Status;
    let i, indexB:number;

    for (i = 1; i <= endValue; i++) {
        status = {divisible:false};

        fizz = (rules.type3) ? getString(i, 3, FIZZ_STR, status) : EMPTY_STR;
        buzz = (rules.type5) ? getString(i, 5, BUZZ_STR, status) : EMPTY_STR;
        fezz = (rules.type13) ? getString(i, 13, FEZZ_STR, status) : EMPTY_STR;
        bang = getString(i, 7, BANG_STR, status);

        if (i % 11 == 0) {
            console.log(fezz + BONG_STR);
            continue;
        }

        if (status.divisible) {
            if (i % 17 == 0) {
                console.log(bang + buzz + fizz);
                continue;
            }

            message = fizz + buzz + bang;
            indexB = message.indexOf("B");

            if (message == "" && fezz == "") {
                console.log(i);
                continue;
            }

            if (indexB == -1) {
                console.log(message + fezz);
            } else {
                console.log(message.substring(0, indexB) + fezz + message.substring(indexB));
            }

        } else {
            console.log(i);
        }
    }
}

// Custom functionality added by user
function customMode(endValue: number): void {
    let i: number;
    let message: string;
    let status: Status;

    for (i = 1; i <= endValue; i++) {
        status = {divisible: false};
        message = "";
        for (let entry of customRulesMap.entries()) {
            message += getString(i, entry[0], entry[1], status);
        }

        if (status.divisible) {
            console.log(message);
        } else {
            console.log(i);
        }
    }
}

// Get 'y' / 'n' from user and convert it to a boolean value
function getBooleanFromUser(message: string): boolean {
    let str: string = prompt2(message)??"";
    let valid: boolean = (str == 'y' || str == 'n');

    while (!valid) {
        str = prompt2('Invalid option. Please try again:')??"";
        valid = (str == 'y' || str == 'c');
    }

    return str.indexOf('y') != -1;
}

function getTypesFromUser(): void {
    rules.type3 = getBooleanFromUser('Implement type 3 rule? (y/n):');
    rules.type5 = getBooleanFromUser('Implement type 5 rule? (y/n):');
    rules.type13 = getBooleanFromUser('Implement type 13 rule? (y/n):');
}

// Prompt the user to provide the running mode (default - fizzbuzz, or custom)
function getModeFromUser(): string {
    let str:string = prompt2('Please choose mode (d - default/ c - custom):')??"";
    let valid: boolean = (str == 'd' || str == 'c');

    while (!valid) {
        str = prompt2('Invalid choice. Please try again:')??"";
        valid = (str == 'd' || str == 'c');
    }

    return (str == 'd') ? 'DEFAULT' : 'CUSTOM';
}

function getNumberFromUser(): number {
    return parseInt(prompt2('Please enter a number:') ?? "1");
}

function getStringFromUser(): string {
    return prompt2('Please enter a string:')??"";
}

function getRuleFromUser(): [number, string] {
    let num: number = getNumberFromUser();
    let message: string = getStringFromUser();
    return [num, message];
}

function getCustomRulesFromUser(customRulesMap:Map<number, string>): void {
    let input: boolean = getBooleanFromUser('Enter a new rule? (y/n):');
    let num: number;
    let message: string;
    while (input) {
        [num, message] = getRuleFromUser();
        customRulesMap.set(num, message);

        input = getBooleanFromUser('Enter a new rule? (y/n):');
    }
}

function main(): void {
    mode = getModeFromUser();
    console.log(`Now running in ${mode} mode`);
    let endValue: number = parseInt(prompt2('Please enter a number:') ?? "0");

    if (mode == 'DEFAULT') {
        getTypesFromUser();

        fizzbuzz(endValue, rules);
    } else {
        getCustomRulesFromUser(customRulesMap);

        customMode(endValue);
    }
}

main();
