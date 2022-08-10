// Create server url
const myServerUrl = "https://localhost:7284";

// 1. Create global userWalletAddress variable
window.userWalletAddress = null;

// 2. when the browser is ready
window.onload = async (event) => {

  // 2.1 check if ethereum extension is installed
  if (window.ethereum) {

    // 3. create web3 instance
    window.web3 = new Web3(window.ethereum);

  } else {

    // 4. prompt user to install Metamask
    alert("Please install MetaMask or any Ethereum Extension Wallet");
  }

  // 5. check if user is already logged in and update the global userWalletAddress variable
  window.userWalletAddress = window.localStorage.getItem("userWalletAddress");

  // 6. show the user dashboard
  showUserDashboard();
};


// 1. Web3 login function
const loginWithEth = async () => {
  // 1.1 Check if there is global window.web3 instance
  if (window.web3) {
    try {
      // 2. Get the user's ethereum account - prompts metamask to login
      const selectedAccount = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => accounts[0])
        .catch(() => {
          // 2.1 If the user cancels the login prompt
          throw Error("Please select an account");
        });

        // 3. Get the chain Id
        const chainId = await window.ethereum
        .request({
          method: "eth_chainId",
        })
        .then((chainData) => {
          return parseInt(chainData, 16); })
        .catch((ex) => {
          // 2.1 If the user cancels the login prompt
          throw Error(ex);
        });
      
      // 3. Set the global userWalletAddress variable to selected account
      window.userWalletAddress = selectedAccount;

      // 4. Store the user's wallet address in local storage
      window.localStorage.setItem("userWalletAddress", selectedAccount);

      // 5. Request signature message from serverside
      const msgRequestUrl = `${myServerUrl}/Authentication/${selectedAccount}/0/${chainId}`;
      const msg = await xhr("POST", msgRequestUrl);

      // 6. Request that the user sign the message
      const signature = await web3.eth.sign(msg.message, selectedAccount);

      const verifyData = {message: msg.message, signature: signature};
      const verifyRequestUrl = `${myServerUrl}/Authentication/verify/0`;
      const authToken = await xhr("POST", verifyRequestUrl, JSON.stringify(verifyData));

      alert("Authenticated: " + authToken.token);

      // 5. Show the user dashboard
      showUserDashboard();

    } catch (error) {
      alert(error);
    }
  } else {
    alert("wallet not found");
  }
};

// 6. when the user clicks the login button run the loginWithEth function
document.querySelector(".login-btn").addEventListener("click", loginWithEth);

// function to show the user dashboard
const showUserDashboard = async () => {

  // if the user is not logged in - userWalletAddress is null
  if (!window.userWalletAddress) {

    // change the page title
    document.title = "Web3 Login";

    // show the login section
    document.querySelector(".login-section").style.display = "flex";

    // hide the user dashboard section
    document.querySelector(".dashboard-section").style.display = "none";

    // return from the function
    return false;
  }

  // change the page title
  document.title = "Web3 Dashboard 🤝";

  // hide the login section
  document.querySelector(".login-section").style.display = "none";

  // show the dashboard section
  document.querySelector(".dashboard-section").style.display = "flex";

  // show the user's wallet address
  showUserWalletAddress();

  // get the user's wallet balance
  getWalletBalance();
};

// show the user's wallet address from the global userWalletAddress variable
const showUserWalletAddress = () => {
  const walletAddressEl = document.querySelector(".wallet-address");
  walletAddressEl.innerHTML = window.userWalletAddress;
};

// get the user's wallet balance
const getWalletBalance = async () => {
  // check if there is global userWalletAddress variable
  if (!window.userWalletAddress) {
    return false;
  }

  // get the user's wallet balance
  const balance = await window.web3.eth.getBalance(window.userWalletAddress);

  // convert the balance to ether
  document.querySelector(".wallet-balance").innerHTML = web3.utils.fromWei(
    balance,
    "ether"
  );
};

// web3 logout function
const logout = () => {
  // set the global userWalletAddress variable to null
  window.userWalletAddress = null;

  // remove the user's wallet address from local storage
  window.localStorage.removeItem("userWalletAddress");

  // show the user dashboard
  showUserDashboard();
};

// AJAX call
const xhr = (method, url, data) => {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    
    xhr.open(method, url);

    // Set CORS headers
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

    // Create a response listener
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        // Handle good response
        resolve(parse(xhr.response));
      } else {
        // Handle error response
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };

    // Create an error listener
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };

    // Send the request
    if(method=="POST" && data){
      xhr.setRequestHeader('Content-type', 'application/json'); 
        xhr.send(data);
    }else{
        xhr.send();
    }
  });
}

// Parse ajax call from json to object.
const parse = (text) => {
  try {
     return JSON.parse(text);
  } catch(e){
     return text;
  }
}

// when the user clicks the logout button run the logout function
document.querySelector(".logout-btn").addEventListener("click", logout);


