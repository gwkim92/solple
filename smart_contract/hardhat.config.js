require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/EljfmdTBAYhwOTlbgy7LQ7tryyictsAf',
      accounts: [
        'dff8423e01c2d60a83cc7e19bd24e104fcec0a4a134b09d484d1e998ed457a3e',
      ],
    },
  },
}