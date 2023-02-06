# Kolo: DAO auction for sensitive information

This repository contains smart contracts and developer tools for Kolo which powers [https://kolo.vercel.app/]

## What is Kolo?

Kolo Protocol - censorship resistant trading platform for sensitive information with transparent notary mechanics. Organize auctions, tenders, p2p-sales for exclusive content or services. Crowdfund DeScience projects or online meetings with celebrities. Trade files, storage, computing or access.

## Description

Filecoin's main value proposition is providing a decentralized and censorship-resistant alternative to traditional cloud storage providers. That’s why we've built a tool that creates new use cases for enlarging the network and illuminating the uniqueness of Filecoin.
Kolo is a cutting-edge project being developed for the FVM Space Warp Hackathon. It aims to create a fair and censorship-resistant platform for trading sensitive information, leveraging the power of the Filecoin network and governed by the DAO. 

## Documentation

#### Whitepaper: in progress

For more comprehensive information about Kolo you can read our whitepaper and project description on our [Documentation](https://deforex-docs.gitbook.io/kolo-fevm-hackathon/welcome/kolo-dao-auction-for-sensitive-information).

#### Technical Documentation

Check our full Documentation [here](https://deforex-docs.gitbook.io/kolo-fevm-hackathon/welcome/kolo-dao-auction-for-sensitive-information) for more technical details.

## Smart contracts

Copy .env.example to .env and define all variables.

`yarn`

or

`npm install`

### Deploy & configure

```
yarn compile
npx hardhat scripts/deploy-full.ts --network <network>
```

**network** - the following networks are supported in this code: `hyperspace`


```