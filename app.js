let web3;
let carRentalContract;
let contractAddress = '0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c'; // Replace with your contract's deployed address
let abi = [[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rentalPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_lateFeePerDay",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "renter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			}
		],
		"name": "Booked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carId",
				"type": "uint256"
			}
		],
		"name": "CarAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "renter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "LateFeePaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "renter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carId",
				"type": "uint256"
			}
		],
		"name": "Returned",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "addCar",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_carId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_days",
				"type": "uint256"
			}
		],
		"name": "bookCar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bookings",
		"outputs": [
			{
				"internalType": "address",
				"name": "renter",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "carId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountPaid",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_renter",
				"type": "address"
			}
		],
		"name": "calculateLateFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "carIdToRenter",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cars",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "enum CarRental.CarStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lateFeePerDay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rentalPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_carId",
				"type": "uint256"
			}
		],
		"name": "returnCar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_lateFeePerDay",
				"type": "uint256"
			}
		],
		"name": "setLateFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rentalPrice",
				"type": "uint256"
			}
		],
		"name": "setRentalPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]]; // Replace with your contract's ABI (from Remix or your deployment tool)

async function loadBlockchainData() {
    // Modern dapp browsers
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            if (accounts.length == 0) {
                alert("Please connect to MetaMask.");
            } else {
                initContract();
                document.getElementById('car-rental-interface').style.display = 'block';
            }
        } catch (error) {
            console.error(error);
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        web3 = window.web3;
        initContract();
    }
    // Non-dapp browsers
    else {
        alert('Non-Ethereum browser detected. Consider using MetaMask!');
    }
}

function initContract() {
    carRentalContract = new web3.eth.Contract(abi, contractAddress);
}

async function addCar() {
    const accounts = await web3.eth.getAccounts();
    carRentalContract.methods.addCar().send({from: accounts[0]})
    .on('receipt', receipt => {
        console.log(receipt);
        alert("Car added!");
    })
    .on('error', error => {
        console.error(error);
        alert("There was an error!");
    });
}

async function bookCar() {
    const accounts = await web3.eth.getAccounts();
    const carId = document.getElementById('bookCarId').value;
    const days = document.getElementById('bookDays').value;
    const amountToSend = web3.utils.toWei((days * rentalPrice).toString(), 'ether');
    
    carRentalContract.methods.bookCar(carId, days).send({from: accounts[0], value: amountToSend})
    .on('receipt', receipt => {
        console.log(receipt);
        alert("Car booked!");
    })
    .on('error', error => {
        console.error(error);
        alert("There was an error!");
    });
}

async function returnCar() {
    const accounts = await web3.eth.getAccounts();
    const carId = document.getElementById('returnCarId').value;
    const lateFeeAmount = document.getElementById('lateFee').value; // This needs to be calculated or informed beforehand to the user
    const amountToSend = web3.utils.toWei(lateFeeAmount, 'ether');

    carRentalContract.methods.returnCar(carId).send({from: accounts[0], value: amountToSend})
    .on('receipt', receipt => {
        console.log(receipt);
        alert("Car returned!");
    })
    .on('error', error => {
        console.error(error);
        alert("There was an error!");
    });
}

async function withdrawFunds() {
    const accounts = await web3.eth.getAccounts();
    carRentalContract.methods.withdrawFunds().send({from: accounts[0]})
    .on('receipt', receipt => {
        console.log(receipt);
        alert("Funds withdrawn!");
    })
    .on('error', error => {
        console.error(error);
        alert("There was an error!");
    });
}
