export function adjustPrivatisationDate(date: Date, isPrivatisation?: boolean): Date {
if (!isPrivatisation || date.getDay() === 0) return date;

const nextSunday = new Date(date);
const daysToAdd = (7 - date.getDay()) % 7;
nextSunday.setDate(date.getDate() + daysToAdd);

return nextSunday;
}