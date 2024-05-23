# @mizuwallet-sdk/core

## Installation

```base
$ pnpm add graphql-request buffer @aptos-labs/ts-sdk @mizuwallet-sdk/core
```

## Usage

Initialized by **APP_ID**

```ts
import { Mizu } from '@mizuwallet-sdk/core';

const MIZU_WALLET_APP_ID = 'xxxxx';

// Initialization
const MizuClient = new Mizu({
  appId: MIZU_WALLET_APP_ID,
  // 'mainnet'  | 'testnet'
  network: 'mainnet',
});
```

Login In **Telegram** [[Docs of Telegram Mini App](https://core.telegram.org/bots/webapps#designing-mini-apps)]

```ts
await MizuClient.loginInTG(window.Telegram.WebApp.initData);
```

Fetch User's Address

```ts
const address: string = await MizuClient.getUserWalletAddress();
```

### Functions

1. Create Order

The very first step is **Order Creation**, when your user try to interactive with the chain.

```ts
const orderId: any = await MizuClient.createOrder({
  payload: {
    function: '0x1::aptos_account::transfer_coins',
    typeArguments: ['0x1::aptos_coin::AptosCoin'],
    functionArguments: ['0x12345abcde', 10000000],
  },
});

// orderId: 1234-abcd-12312412
```

2. Confirm Order

Let the order confirmed by user, and the payload will be submitted to the chain.

```ts
await MizuClient.confirmOrder({
  orderId: '1234-abcd-12312412',
});
```

