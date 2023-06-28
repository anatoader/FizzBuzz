const prompt_sync = require('prompt-sync')({sigint: true});

const FIZZ_STR: string = "Fizz";
const BUZZ_STR: string = "Buzz";
const BANG_STR: string = "Bang";
const BONG_STR: string = "Bong";
const FEZZ_STR: string = "Fezz";
const EMPTY_STR: string = "";

// Running mode (DEFAULT / CUSTOM)
let mode: string;

type Rules = {
    type3: boolean;
    type5: boolean;
    type13: boolean;
}

function fizzbuzz(endValue: number, rules:Rules): void {
    let fizz, buzz, bang, fezz, message: string;
    let currNumber, indexB:number;

    for (currNumber = 1; currNumber <= endValue; currNumber++) {
        fizz = (rules.type3 && currNumber % 3 == 0) ? FIZZ_STR : EMPTY_STR;
        buzz = (rules.type5 && currNumber % 5 == 0) ? BUZZ_STR : EMPTY_STR;
        fezz = (rules.type13 && currNumber % 13 == 0) ? FEZZ_STR : EMPTY_STR;
        bang = (currNumber % 7 == 0) ? BANG_STR : EMPTY_STR;

        if (currNumber % 11 == 0) {
            console.log(fezz + BONG_STR);
            continue;
        }

        message = fizz + buzz + bang;

        if (message != "") {
            if (currNumber % 17 == 0) {
                console.log(bang + buzz + fizz);
                continue;
            }

            indexB = message.indexOf("B");

            if (indexB == -1) {
                console.log(message + fezz);
            } else {
                console.log(message.substring(0, indexB) + fezz + message.substring(indexB));
            }

        } else {
            console.log(currNumber);
        }
    }
}

// Custom functionality added by user
function customMode(endValue: number): void {
    let currNumber: number;
    let message: string;

    let customRulesMap: Map<number, string> = getCustomRulesFromUser();

    for (currNumber = 1; currNumber <= endValue; currNumber++) {
        message = "";
        customRulesMap.forEach((customMessage: string, divisor: number) => {
            message += (currNumber % divisor == 0) ? customMessage : "";
        });

        console.log((message != "") ? message : currNumber);
    }
}

// Get 'y' / 'n' from user and convert it to a boolean value
function getBooleanFromUser(message: string): boolean {
    let str: string = prompt_sync(message)??"";
    let valid: boolean = (str == 'y' || str == 'n');

    while (!valid) {
        str = prompt_sync('Invalid option. Please try again:')??"";
        valid = (str == 'y' || str == 'n');
    }

    return str == 'y';
}

function getTypesFromUser(): Rules {
    let rules:Rules = {type3:false, type5:false, type13:false};
    rules.type3 = getBooleanFromUser('Implement type 3 rule? (y/n):');
    rules.type5 = getBooleanFromUser('Implement type 5 rule? (y/n):');
    rules.type13 = getBooleanFromUser('Implement type 13 rule? (y/n):');

    return rules;
}

// Prompt the user to provide the running mode (default - fizzbuzz, or custom)
function getModeFromUser(): string {
    let str:string = prompt_sync('Please choose mode (d - default/ c - custom):')??"";
    let valid: boolean = (str == 'd' || str == 'c');

    while (!valid) {
        str = prompt_sync('Invalid choice. Please try again:')??"";
        valid = (str == 'd' || str == 'c');
    }

    return (str == 'd') ? 'DEFAULT' : 'CUSTOM';
}

function getNumberFromUser(): number {
    return parseInt(prompt_sync('Please enter a number:') ?? "1");
}

function getStringFromUser(): string {
    return prompt_sync('Please enter a string:')??"";
}

function getRuleFromUser(): [number, string] {
    let num: number = getNumberFromUser();
    let message: string = getStringFromUser();
    return [num, message];
}

function getCustomRulesFromUser(): Map<number, string> {
    let customRulesMap: Map<number, string> = new Map();
    let input: boolean = getBooleanFromUser('Enter a new rule? (y/n):');
    let divisor: number;
    let customMessage: string;

    while (input) {
        [divisor, customMessage] = getRuleFromUser();
        customRulesMap.set(divisor, customMessage);

        input = getBooleanFromUser('Enter a new rule? (y/n):');
    }

    return customRulesMap;
}

function main(): void {
    mode = getModeFromUser();
    console.log(`Now running in ${mode} mode`);
    let endValue: number = parseInt(prompt_sync('Please enter a number:') ?? "0");

    if (mode == 'DEFAULT') {
        let rules: Rules = getTypesFromUser();

        fizzbuzz(endValue, rules);
    } else {
        customMode(endValue);
    }
}

main();
