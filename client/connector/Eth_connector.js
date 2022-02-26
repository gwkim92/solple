require('dotenv').config();


const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);

const fs = require('fs');

const newContract = (web3, abi, ca) => {
	return new web3.eth.Contract(abi, ca, {
		from: process.env.SERVERADDRESS,
		gas: 3000000,
	});
};

const USERNFTABI = fs.readFileSync('client/abi/Nft.json', 'utf-8');


const nftAbi = JSON.parse(USERNFTABI);


const nftContract = newContract(web3, nftAbi, process.env.NFTADDRESS); // nft


// const serverAddress = process.env.SERVERADDRESS;
// const serverPrivateKey = process.env.SERVERPRIVATEKEY;

module.exports = {
	nftContract,
};
