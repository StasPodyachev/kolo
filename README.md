# Kolo: DAO auction for sensitive information

This repository contains smart contracts and developer tools for Kolo which powers [https://kolo.vercel.app/]

## What is Kolo?

Kolo Protocol - censorship resistant trading platform for sensitive information with transparent notary mechanics. Organize auctions, tenders, p2p-sales for exclusive content or services. Crowdfund DeScience projects or online meetings with celebrities. Trade files, storage, computing or access.

## Description

Filecoin's main value proposition is providing a decentralized and censorship-resistant alternative to traditional cloud storage providers. That’s why we've built a tool that creates new use cases for enlarging the network and illuminating the uniqueness of Filecoin.
Kolo is a cutting-edge project being developed for the FVM Space Warp. It aims to create a fair and censorship-resistant platform for trading sensitive information, leveraging the power of the Filecoin network and governed by the DAO. 

## Main idea of Kolo

With Kolo, users will be able to buy and sell a wide variety of files, storage, and computing resources, as well as gain access to exclusive content. This includes everything from sensitive business documents and information of public interest to unique and valuable data sets. 

## Types of trading

We’ve started with auctions, tenders and p2p sales, but the DAO members will be able to implement new ways of development and new use cases of the platform.

## Examples of use

As DeFi enthusiasts, we see a huge perspective in commodity trading, minimizing intermediary’s role and including developing countries into the global trade and hedging with Kolo.
Our platform can also be used for monetizing users' personal data on their behalf and by their initiative, contrary to the traditional system where all data is owned and traded by large corporations.
We also offer the ability to organize exclusive online meetings with celebrities and experts. This can include everything from AMA sessions and live chats to virtual meet-and-greets and more. 
Kolo can be used as a tender platform to easily start and run charity and science projects, building a solid foundation for decentralized society (DeSoc) and decentralized science as it was described by Vitalik Buterin. 

## Notary mechanics

Perhaps most importantly, we power our platform with transparent notary mechanics. This means that the buyer will be able to start the dispute if he considers the seller cheated him with file description. 

Notaries will be chosen randomly from a list of DAO participants who deposited a notary collateral. If the seller is confident in the high quality of his goods or service, he can offer a guarantee deposit, which will be used as a payment to notaries if the buyer will initiate a dispute and win it. 

Check our full Documentation [here](https://deforex-docs.gitbook.io/kolo-fevm-hackathon/product/notary-system)

## DAO

Open reputation system lets everyone see any participant’s actions’ history and reviews, but decisions about its design will be made by DAO in the future.

## Summary

Overall, Kolo is an innovative and exciting project that has the potential to revolutionize the way sensitive information is handled and shared online. With its use of cutting-edge technology and its commitment to transparency and fairness, it is sure to make a big impact in the world of online auctions and information sharing.

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