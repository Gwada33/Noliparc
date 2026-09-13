// Prix des chaussettes (référence unique pour tout le site)
export const SOCKS_PRICE_CHILD = 5;
export const SOCKS_PRICE_ADULT = 8.99;

export const formules = [
  {
    value: "formule-grenouille",
    label: "Formule Grenouille",
    enfantMin: 14,
    pricePerChild: 20,
    timeSlots: ["10:30 - 12:00", "13:30 - 15:00", "15:30 - 17:00"],
  },
  {
    value: "formule-foumi-manioc",
    label: "Formule Foumi Manioc",
    enfantMin: 15,
    pricePerChild: 30,
    timeSlots: ["10:30 - 12:30", "13:00 - 15:00", "15:30 - 17:30"],
  },
  {
    value: "formule-mangouste-(privatisation-dimanche)",
    label: "Formule Mangouste (privatisation dimanche)",
    enfantMin: 20,
    pricePerChild: 30,
    privatisationHourly: 50,
    privatisationHours: 3,
    isPrivatisation: true,
    timeSlots: ["10:00 - 13:00"],
  },
  {
    value: "happyjump-birthday",
    label: "HappyJump Birthday",
    enfantMin: 8,
    adultMax: 2,
    pricePerChild: 18,
    timeSlots: ["10:00 - 11:30"],
  },
  {
    value: "partyjump-birthday",
    label: "PartyJump Birthday",
    enfantMin: 8,
    adultMax: 2,
    pricePerChild: 20,
    timeSlots: ["13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00"],
  },
  {
    value: "fiestajump-birthday",
    label: "FiestaJump Birthday",
    enfantMin: 8,
    adultMax: 2,
    pricePerChild: 25,
    timeSlots: ["13:00 - 14:30", "14:00 - 15:30", "15:00 - 16:30"],
  },
  {
    value: "golden-birthday-(privatisation-dimanche)",
    label: "GOLDEN Birthday (privatisation dimanche)",
    enfantMin: 15,
    adultMax: 2,
    pricePerChild: 30,
    privatisationHourly: 50,
    privatisationHours: 2.5,
    isPrivatisation: true,
    timeSlots: ["10:00 - 12:30"],
  },
];