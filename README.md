# sample-staking-protocol-upgradable

## For Developer

**Setup & Deploy**

```bash
yarn && yarn compile
npx hardhat node --hostname 0.0.0.0
yarn hardhat run scripts/deploy.ts --network localhost
```

**Operation check**

```bash
yarn mock-mint:local
yarn scenario:local
```
