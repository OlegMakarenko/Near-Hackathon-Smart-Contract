// Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
async function connect() {
  // Initializing connection to the NEAR node.
  window.near = await nearlib.connect(Object.assign(nearConfig, { deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore() }}));

  // Needed to access wallet login
  window.walletAccount = new nearlib.WalletAccount(window.near);

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: [
      "totalSupply", 
      "balanceOf", 
      "allowance", 
      "getSponsor",
      "getBank"
    ],
    changeMethods: [
      "init", 
      "transfer", 
      "approve", 
      "transferFrom", 
      "setSponsor"
    ],
    sender: window.walletAccount.getAccountId()
  });
}

function updateUI() {
  if (!window.walletAccount.getAccountId()) {
    Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = "display: block;");
  } else {
    Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = "display: block;");
  }

  getBank();
}

// Log in user using NEAR Wallet on "Sign In" button click
document.querySelector('.sign-in .btn').addEventListener('click', () => {
  walletAccount.requestSignIn(nearConfig.contractName, 'NEAR Studio Counter');
});

document.querySelector('.sign-out .btn').addEventListener('click', () => {
  walletAccount.signOut();
  // TODO: Move redirect to .signOut() ^^^
  window.location.replace(window.location.origin + window.location.pathname);
});

window.nearInitPromise = connect()
  .then(updateUI)
  .catch(console.error);


document.getElementById("set").addEventListener("click", () => { setSponsor() } );
document.getElementById("get").addEventListener("click", () => { getSponsor() } );

async function setSponsor(){
  var address = document.getElementById("s_s_a").value;
  var value = document.getElementById("s_s_v").value;
  console.log(address, value);
  await contract.setSponsor({address: address, amount: Number(value)});
}

async function getSponsor(){
  var address = document.getElementById("g_s_a").value;
  var value = document.getElementById("g_s_v");
  console.log(address);
  let a = await contract.getSponsor({address: address});
  console.log(a)
  value.value = a;
}


async function getBank(){
  let a = await contract.getBank();
  console.log("Bank", a)
}