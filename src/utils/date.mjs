import { add, endOfDay, startOfDay } from "date-fns";

export const createStartDate = (date) => {
    return new Date(date).getTime();
}

export const createEndDate = (date, options) => {
    return endOfDay(add(date, options)).getTime();
}