<template>
  <div class="h-1000">
    <div class="flex flex-col max-w-[750px] mx-auto my-10">
      <button class="btn btn-primary">Connect Mizu Wallet</button>
    </div>

    <span>UI support interact interface to dapp or app user, reduce the work of developer</span>
    <span>UI supported by core package</span>

    <mizu-wallet-main></mizu-wallet-main>
    <mizu-connect-button></mizu-connect-button>
  </div>
  <mizu-connect-modal></mizu-connect-modal>
</template>

<script setup lang="ts">
  import { MizuConnectButton, MizuConnectModal, MizuWalletMain } from '@mizuwallet-sdk/wallet-ui';
</script>

<style scoped></style>
