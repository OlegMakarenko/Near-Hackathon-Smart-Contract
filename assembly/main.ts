//@nearfile
import { context, storage, logging, collections, PersistentMap, PersistentTopN } from "near-runtime-ts";
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
//let members = new PersistentTopN<i32>("m:");
let totalAmount = 0;


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
    //score: i32; 
    amount: i32 
}



export function finalize(address: string): String {

  let top3Members: Array<string>;  // Array of top 3 accounts. Have to be get from Map "members". 

  //TODO sort and put addresses to Array "top3Mambers"


  //let top3 = members.getTop(3);
  let winners: Winner[];

  for(let i = 0; i < top3Members.length; i++)
   winners[i]=({
       address: <string>top3Members[i],
       //score: <i32>members.get(top3Members[i]),
       amount: <i32>(getAmmountForWinner(i+1))
     })

  let encoder = new JSONEncoder();


  //TODO put data to JSON string and retun it



  // Construct necessary object
  // encoder.pushObject("obj");
  // for(let i in topMembers)
  //   if(topMembers[0].address)
  //     encoder.setString(""+topMembers[i].address, ""+topMembers[i].score);
  // encoder.popObject();

  // // Get serialized data
  // let json: Uint8Array = encoder.serialize();

  // // Or get serialized data as string
  // let jsonString: String = encoder.toString();
  return "{JSON}";
}




