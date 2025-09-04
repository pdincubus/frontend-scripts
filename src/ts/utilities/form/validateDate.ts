import { determineErrorDisplay } from "./determineErrorDisplay.js";

export function validateDate (
    dobDayInput: HTMLInputElement,
    dobMonthInput: HTMLInputElement,
    dobYearInput: HTMLInputElement
): boolean {
    let allValid = true;
    let dayValid = true;
    let monthValid = true;
    let yearValid = true;

    if (dobDayInput.value  === '') {
        allValid = false;
        dayValid = false;
    }

    if (dobMonthInput.value === '') {
        allValid = false;
        monthValid = false;
    }

    if (dobYearInput.value === '') {
        allValid = false;
        yearValid = false;
    }

    const thisYear = parseInt(dobYearInput.value, 10) as number || 0;
    const thisMonth = parseInt(dobMonthInput.value, 10) as number || 0;
    const thisDay = parseInt(dobDayInput.value, 10) as number || 0;

    var thenDate = new Date(thisYear, thisMonth - 1, thisDay);

    if (
        (thenDate.getMonth() + 1 !== thisMonth)
        || (thenDate.getDate() !== thisDay)
        || (thenDate.getFullYear() !== thisYear)
    ) {
        yearValid = false;
        monthValid = false;
        dayValid = false;
        allValid = false;
    }

    const age = 18;

    let todaysDate = new Date() as Date;
    let dob = new Date() as Date;
    let nearestAllowedDate = new Date() as Date;

    dob.setFullYear(thisYear, thisMonth - 1, thisDay);
    nearestAllowedDate.setFullYear(todaysDate.getFullYear() - age);

    if ((nearestAllowedDate.getTime() - dob.getTime()) < 0) {
        yearValid = false;
        monthValid = false;
        dayValid = false;
        allValid = false;
    }

    determineErrorDisplay(dayValid, dobDayInput.id);
    determineErrorDisplay(monthValid, dobMonthInput.id);
    determineErrorDisplay(yearValid, dobYearInput.id);
    determineErrorDisplay(allValid, dobYearInput.id);

    return allValid;
}