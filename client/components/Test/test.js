import {useState} from 'react';
import Web3 from 'web3';
import TokenList from './TestList';

function App() {
		const [web3, setWeb3] = useState();
        const [account, setAccount] = useState('');

        const [newErc721addr, setNewErc721Addr] = useState();

        const [erc721list, setErc721list] = useState([]);


    useEffect(() => {
        if (typeof window.ethereum !== "undefined") { // window.ethereum이 있다면
            try {
                const web = new Web3(window.ethereum);  // 새로운 web3 객체를 만든다
                setWeb3(web);
            } catch (err) {
                console.log(err);
            }
        }
    }, []);

    const connectWallet = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
    };


    const addNewErc721Token = async () => {
        const tokenContract = await new web3.eth.Contract(
            erc721Abi,
            newErc721addr
        );
        const name = await tokenContract.methods.name().call();
        const symbol = await tokenContract.methods.symbol().call();
        const totalSupply = await tokenContract.methods.totalSupply().call();
        let arr = [];
		  for (let i = 1; i <= totalSupply; i++) {
		      arr.push(i);
		  }
        
          for (let tokenId of arr) {
            let tokenOwner = await tokenContract.methods
                .ownerOf(tokenId)
                .call();
            if (String(tokenOwner).toLowerCase() === account) {
                let tokenURI = await tokenContract.methods
                    .tokenURI(tokenId)
                    .call();
                setErc721list((prevState) => {
                    return [...prevState, { name, symbol, tokenId, tokenURI }];
                });
            }
        }
  }
  



    return (
        <div className="App">
        <button
            className="metaConnect"
            onClick={() => {
                connectWallet();
            }}
        >
            connect to MetaMask
        </button>
        <div className="userInfo">주소: {account}</div>  // 연결된 계정 주소를 화면에 출력합니다
        <input
	        type="text"
	        onChange={(e) => {
	            setNewErc721Addr(e.target.value);  // 입력받을 때마다 newErc721addr 갱신
	        }}
	    ></input>
	    <button onClick={addNewErc721Token}>add new erc721</button>
        <TokenList erc721list={erc721list} />
    </div>
    
    
);
}