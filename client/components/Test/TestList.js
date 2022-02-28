import TestErc721 from "./Erc721";

function TokenList({erc721list }) {
    return (
        <div className="tokenlist">
            <TestErc721 erc721list={erc721list}  />
        </div>
    );
}

export default TokenList;