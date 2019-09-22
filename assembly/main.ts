//@nearfile
import { context, storage, logging, collections, PersistentMap, PersistentVector, PersistentTopN } from "near-runtime-ts";
//import "allocator/arena";
// Import encoder
import { JSONEncoder } from "assemblyscript-json";

// --- contract code goes below

let balances = new PersistentMap<string, u64>("b:");
let approves = new PersistentMap<string, u64>("a:");


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







////
////SMART HACKATHON
////





let sponsors = new PersistentMap<string, i32>("s:");
let judges = new PersistentMap<string, i32>("j:");
let members = new PersistentMap<string, i32>("m:");
let membersAccounts = new PersistentVector<string>("ma:"); 
//let members = new PersistentTopN<i32>("m:");
let totalAmount: i32 = 0;

export function getBank(): i32 {
  return totalAmount;
}

export function setSponsor(address: string, amount: i32): void {
  storage.set<i32>("s:" + address, amount);
  totalAmount += amount;
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
  membersAccounts.push(address);
}

export function setMemberScore(address: string, score: i32): void {
  let judge = storage.getPrimitive<i32>("j:" + context.sender, 0);
  if(judge !== 0)
    storage.set<i32>("m:" + address, score);
}

export function getMemberScore(address: string): i32 {
  let member = storage.getPrimitive<i32>("m:" + address, 0)
  return member;
}

function closeHackathon(): void {
  
}





function getAmmountForWinner(place: i32): i32 {
  let prize: i32;
  if(place>3) 
    prize = totalAmount / 2;
  else 
    prize = totalAmount;

  totalAmount -= prize;
  return prize;
}

class Winner {
    address: string; 
    score: i32; 
    amount: i32 
}

class Member {
  address: string; 
  score: i32; 
}



export function finalize(address: string): Winner[] {
  let memberRank: Array<Member>;

  for(let i = 0; i < membersAccounts.length; i++) {
    memberRank.push({address: membersAccounts[i], score: getMemberScore(membersAccounts[i])});
  }

  memberRank.sort((l, r): i32 => {
    if(l.score < r.score) return -1;
    if(l.score > r.score) return 1;
    return 0;
  });

  let winners: Winner[];

  for(let i = 0; i < memberRank.length; i++)
   winners[i]=({
       address: <string>memberRank[i].address,
       score: <i32>memberRank[i].score,
       amount: <i32>(getAmmountForWinner(i+1))
     })

  let encoder = new JSONEncoder();

  closeHackathon()

  return winners;
}




