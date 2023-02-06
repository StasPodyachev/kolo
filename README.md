# Kolo 

This repository contains smart contracts and developer tools for Kolo which powers [https://kolo.vercel.app/]

## What is Kolo?


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