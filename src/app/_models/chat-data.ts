import { User, STATUSES, Message } from "src/app/_models/chat";

export const RANDOM_MSGS = [

];

export const blacklistMsisdn=[]

export const TYPE_OF_MSG: any = ["replies", "sent"];

export const getRandom = items =>
  items[Math.floor(Math.random() * items.length)];

export function generateMessage(length) {
  return Array.from({ length }).map(
    () => new Message(getRandom(TYPE_OF_MSG), getRandom(RANDOM_MSGS), getRandom(blacklistMsisdn))
  );
}

export const MESSAGES = [];

export const USERS = [
  {
    blacklistMsisdn: "",
  },
]
