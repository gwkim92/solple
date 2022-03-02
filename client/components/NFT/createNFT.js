import React, { useState, useContext } from "react";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import Swal from "sweetalert2";
import { TransactionContext } from "../../context/transactionContext";

const FirstDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
const SeDiv = styled.div`
  width: 50%;
  height: 60rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: left;
  text-align: left;
`;
const Lable = styled.label`
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: left;
  flex-direction: column;
  cursor: pointer;
 
`;
const ImgDiv = styled.div`
  width: 40%;
  height: 20rem;
  background: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFVoaEtx2HJ9ByTrZXiHhyn3R0upDsswTZlg&usqp=CAU) no-repeat center;
  background-size: 70% 17rem;
  background-color: white;
  outline: none;
  cursor: pointer;
  border-radius: 5%;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  transition: all 0.2s ease-in-out;
  border: 1px dashed grey;
  /* background:rgb(125,231,166); */
  &:hover {
    box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
    transform: translateY(5px);
  }
`;
const ImgInput = styled.input`
  visibility: hidden;
`;
const Input = styled.input`
  width: 100%;
  background-color: transparent;
  border-radius: 2rem;
  border: 2px solid gray;
  color: black;
  font-size: 1.5rem;
  margin-bottom: 2%;
`;

const Img = styled.img`
  width: 70%;
  height: 25rem;
  border: 1px dashed rgb(125, 231, 166);
  border-radius: 5%;
  &:hover {
    box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
    transform: translateY(5px);
  }
`;
const Button = styled.button`
  background: linear-gradient(10deg, #000000, #434343);
  font-size: 1.3rem;
  font-weight: bold;
  color: whitesmoke;
  margin: 3%;
  border: 1px solid #77a1d3;
  border-radius: 6%;
  width: 7rem;
  height: 3rem;
  &:hover {
    box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
    transform: translateY(3px);
  }
`;

const createNFT = () => {

  const { connectWallet, CurrentAccount, nftContract, web3 } = useContext(TransactionContext)
  
  console.log('NFTpage', { connectWallet, CurrentAccount, nftContract, web3})

  
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
  });
  
  const [files, setFiles] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftName, setNftName] = useState("");
  const [price, setPrice] = useState("");

  const onHandleChange = (event) => {
    event.preventDefault();
    setFiles(event.target.files[0]);
    let fileReader = new FileReader();
    let file = event.target.files[0];
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      setImgSrc(e.target.result);
    };
  };
////
const onSubmit = async (e) => {
    e.preventDefault(); //새로고침방지

    if (
      nftDescription === "" ||
      nftName === "" ||
      files === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "check your blank",
      }).then((res) => {
        return;
      });
    }
    
  const imgHash = await ipfs.add(files);
  const metadata = {
    nftName: nftName,
    nftDescription: nftDescription,
    imgURI: `https://ipfs.io/ipfs/${imgHash.path}`,
  };
  const tokenURI = await ipfs.add(JSON.stringify(metadata));
 
  const tokenURIPath = tokenURI.path;
  console.log('hash', imgHash)
  console.log('metadata', metadata)
  console.log('tokenURI', tokenURIPath)
  try {
    await nftContract.methods.mintNFT(tokenURIPath).send({from: CurrentAccount});

  }catch(e){
    console.log('err' + e);
  }

}



  return (
    <>
      <FirstDiv>
        <SeDiv>
          <h1>Create New NFT</h1>
            {imgSrc === "" ? (
              <Lable>
                <ImgDiv>
                  <ImgInput type="file" onChange={onHandleChange} />
                </ImgDiv>
              </Lable>
            ) : (
              <Lable>
                <Img
                  src={imgSrc}
                  onClick={() => {
                    setImgSrc(""), setFiles("");
                  }}
                />
              </Lable>
            )}
            <h2>NFT Name</h2>
            <Input 
              type="text"
              onChange={(e) => {
                setNftName(e.target.value);
              }}
            />
            <h2>Description</h2>
            <Input 
              type="text"
              onChange={(e) => {
                setNftDescription(e.target.value);
              }}
            />
            <h2>Category</h2>
            <Input />
            <Button
                  variant="warning"
                  onClick={onSubmit}
                  style={{ backgroundColor: "transparent"}}
                >
                  CREATE
                </Button>
        </SeDiv>
      </FirstDiv>
    </>
  );
};

export default createNFT;
