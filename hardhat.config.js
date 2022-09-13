require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.15",
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        },
    },
    paths: {
        artifacts: "./artifacts",
        sources: "./newContracts",
        cache: "./cache",
        tests: "./test"
    },
};