//@nearfile
import { context, storage, logging, collections, PersistentMap } from "near-runtime-ts";

// --- contract code goes below

let balances = new PersistentMap<string, u64>("b:");
let approves = new PersistentMap<string, u64>("a:");
//let sponsors = new PersistentMap<string, i32>("d:");


let TOTAL_SUPPLY: u64 = 1000000;


export function init(initialOwner: string): void {
  logging.log("initialOwner: " + initialOwner);
  assert(storage.get<string>("init") == null, "Already initialized token supply");
  balances.set(initialOwner, TOTAL_SUPPLY);
  storage.set<string>("init", "done");
}

export function totalSupply(): string {
  return TOTAL_SUPPLY.toString();
}

export function balanceOf(tokenOwner: string): u64 {
  logging.log("balanceOf: " + tokenOwner);
  if (!balances.contains(tokenOwner)) {
    return 0;
  }
  let result = balances.getSome(tokenOwner);
  return result;
}

export function allowance(tokenOwner: string, spender: string): u64 {
  const key = tokenOwner + ":" + spender;
  if (!approves.contains(key)) {
    return 0;
  }
  return approves.getSome(key);
}

export function transfer(to: string, tokens: u64): boolean {
  logging.log("transfer from: " + context.sender + " to: " + to + " tokens: " + tokens.toString());
  let fromAmount = getBalance(context.sender);
  assert(fromAmount >= tokens, "not enough tokens on account");
  balances.set(context.sender, fromAmount - tokens);
  balances.set(to, getBalance(to) + tokens);
  return true;
}

export function approve(spender: string, tokens: u64): boolean {
  logging.log("approve: " + spender + " tokens: " + tokens.toString());
  approves.set(context.sender + ":" + spender, tokens);
  return true;
}

export function transferFrom(from: string, to: string, tokens: u64): boolean {
  let fromAmount = getBalance(from);
  assert(fromAmount >= tokens, "not enough tokens on account");
  let approvedAmount = allowance(from, to);
  assert(tokens <= approvedAmount, "not enough tokens approved to transfer");
  balances.set(from, fromAmount - tokens);
  balances.set(to, getBalance(to) + tokens);
  return true;
}

function getBalance(owner: string) : u64 {
  return balances.contains(owner) ? balances.getSome(owner) : 0;
}


////HT



//let sponsors = new PersistentMap<string, u64>();
//let judges = new PersistentMap<string, u64>();




let sponsors = new PersistentMap<string, i32>("s:");
let judges = new PersistentMap<string, i32>("j:");
let members = new PersistentMap<string, i32>("m:");


export function setSponsor(address: string, amount: i32): void {
  storage.set<i32>("s:" + address, amount);
}

export function getSponsor(address: string): i32 {
  let sponsor = storage.getPrimitive<i32>("s:" + address, 0)
  return sponsor;
}


export function setJudge(address: string, score: i32): void {
  let sponsor = storage.getPrimitive<i32>("s:" + context.sender, 0);
  if(sponsor !== 0)
    storage.set<i32>("j:" + address, score);
}

export function getJudgeAvailableScore(address: string): i32 {
   let judge = storage.getPrimitive<i32>("j:" + address, 0)
   return judge;
}


export function setMember(address: string): void {
  storage.set<i32>("m:" + address, 0);
}

export function setMemberScore(address: string, score: i32): void {
  let judge = storage.getPrimitive<i32>("j:" + context.sender, 0);
  if(judge !== 0)
    storage.set<i32>("m:" + address, score);
}

export function getMemberScore(address: string): i32 {
   let judge = storage.getPrimitive<i32>("m:" + address, 0)
   return judge;
}




export function finalize(address: string): i32 {
   let judge = storage.getPrimitive<i32>("m:" + address, 0)
   return judge;
}











// export function setSponsor(address: string, amount: i32): boolean {
//   storage.setString(address, <string>amount);
//   return true;
// }

// export function getSponsor(address: string): string | null {
//   return storage.getString(address);
// }