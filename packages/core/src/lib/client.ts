import { Network } from '@aptos-labs/ts-sdk';
import request from 'graphql-request';
import { decodeJWT } from '../helpers/JWTHelper';
import {
  CheckUserIsExistQueryByTgId,
  LoginMutation,
  UserWalletAddressQuery,
  bindGoogleQuery,
  claimTransferQuery,
  confirmOrderQuery,
  createMultipleTransferQuery,
  createOrderQuery,
  createTransferQuery,
  fetchOrderListQuery,
  fetchTransferQuery,
  simulateOrderQuery,
} from '../query';
import { ORDER_STATUS, TRANSFER_TYPE } from './config/enum';

export const GRAPHQL_URL: Record<'mainnet' | 'testnet', string> = {
  testnet: 'https://hasura-wallet.groupwar.xyz/v1/graphql',
  mainnet: 'https://api.mz.xyz/v1/graphql/',
};

export type JWTToken = string;

const SEC_IN_72_HOURS = 3600 * 72;
const SEC_IN_24_HOURS = 3600 * 24;

interface PaginationSettings {
  limit?: number;
  offset?: number;
}

const KEYLESS_GOOGLE_SITE_URL = 'https://dev.fuzzwallet.com:7654/keyless_google';

/**
 * MizuWallet SDK Core Client
 *
 *
 *
 */
export class Mizu {
  appId: string;
  network: Network.MAINNET | Network.TESTNET;
  graphqlEndPoint: string = '';

  userId: string = '';
  jwtToken: string = '';
  initialized: boolean = false;

  /**
   * Initialize MizuWallet SDK Core Client
   *
   * @param args.appId - Application ID
   * @param args.network - Network.MAINNET | Network.TESTNET
   */
  constructor(args: { appId: string; network: Network.MAINNET | Network.TESTNET }) {
    if (!args.appId) throw new Error('appId is required');
    if (!args.network) throw new Error('network is required');

    this.appId = args.appId;
    this.network = args.network;
    this.graphqlEndPoint = GRAPHQL_URL[this.network];

    // after all
    this.initialized = true;
  }

  /**
   * Check if MizuWallet SDK Core Client is initialized
   */
  private checkInitialized() {
    if (!this.initialized) throw new Error('MizuWallet SDK Core Client not initialized');
  }

  /**
   * Check if JWT Token is available
   */
  private checkJWTToken() {
    if (!this.jwtToken) throw new Error('JWT Token not found. Please login first.');
  }

  /**
   * Update network
   * @param network - Network.MAINNET | Network.TESTNET
   */
  updateNetwork(network: Network.MAINNET | Network.TESTNET) {
    this.checkInitialized();
    this.network = network;
    this.graphqlEndPoint = GRAPHQL_URL[this.network];
  }

  /**
   *
   *
   */
  login() {
    this.checkInitialized();
  }

  /**
   * Login in TG
   *
   * @param initData - initial data of TG
   */
  async loginInTG(initData: string) {
    this.checkInitialized();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: LoginMutation,
      variables: {
        appId: this.appId,
        initData,
      },
    });

    try {
      const [userId, jwt]: any = decodeJWT(result.tgLogin);
      this.userId = userId;
      this.jwtToken = jwt;
    } catch {
      this.logout();
    }
  }

  /**
   * Check if user exist by TG ID
   *
   * @param tgId
   * @returns
   */
  async isUserExistByTgID(tgId: string) {
    this.checkInitialized();
    if (!tgId) throw new Error('tgId is required');

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: CheckUserIsExistQueryByTgId,
      variables: {},
      requestHeaders: {
        'x-hasura-tg-id': tgId,
      },
    });

    return result?.telegramUser?.length > 0;
  }

  /**
   * fetch user wallet address
   *
   * @returns
   */
  async getUserWalletAddress() {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: UserWalletAddressQuery,
      variables: {
        id: this.userId,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result.walletUserByPk.sub_wallets[0].address;
  }

  /**
   * Logout
   */
  logout() {
    this.userId = '';
    this.jwtToken = '';
  }

  /**
   *
   */
  getOrderInfo() {}

  /**
   * Create Order
   *
   * @param args.payload TransactionPayload
   * @returns
   */
  async createOrder(args: { payload: any }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: createOrderQuery,
      variables: {
        appId: this.appId,
        payload: window.btoa(JSON.stringify(args.payload)),
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result?.createOrder;
  }

  /**
   *
   * @param args.redirect_uri
   */
  async startBindGoogle(args: { redirect_uri: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const urlSearchParams = new URLSearchParams({
      token: this.jwtToken,
      appId: this.appId,
      ...args,
    });

    window.open(`${KEYLESS_GOOGLE_SITE_URL}?${urlSearchParams.toString()}`, '_blank');
  }

  /**
   *
   * @param args.address keyless address
   * @param args.idToken google jwt
   * @returns
   */
  async bindGoogleAccount(args: { address: string; idToken: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: bindGoogleQuery,
      variables: {
        ...args,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result;
  }

  /**
   * Simulate Order
   *
   * @param args.payload TransactionPayload
   */
  async simulateOrder(args: { payload: any }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: simulateOrderQuery,
      variables: {
        payload: window.btoa(JSON.stringify(args.payload)),
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result?.simulateOrder;
  }

  /**
   * User interactive
   *
   *
   * return bool
   */
  async confirmOrder(args: { orderId: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: confirmOrderQuery,
      variables: {
        orderId: args.orderId,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result?.confirmOrder;
  }

  /**
   * Create Transfer
   *
   * @param args.amount Transfer amount integer
   * @param args.expirationAt expiration time
   * @param args.symbol Transfer Token symbol
   *
   * @returns
   */
  async createTransfer(args: { amount: number; symbol: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: createTransferQuery,
      variables: {
        amount: Math.floor(args.amount),
        expirationAt: Math.floor(Date.now() / 1000) + SEC_IN_24_HOURS,
        symbol: args.symbol,
        type: TRANSFER_TYPE.SINGLE,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result?.createTransfer;
  }

  /**
   * Create Transfer
   *
   * @param args.amount Transfer amount integer
   * @param args.expirationAt expiration time
   * @param args.symbol Transfer Token symbol
   * @param args.count Transfer count
   *
   * @returns
   */
  async createMultipleTransfer(args: { amount: number; symbol: string; count: string | number }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: createMultipleTransferQuery,
      variables: {
        amount: Math.floor(args.amount),
        count: Math.floor(Number(args.count)),
        expirationAt: Math.floor(Date.now() / 1000) + SEC_IN_24_HOURS,
        symbol: args.symbol,
        type: TRANSFER_TYPE.MULTIPLE,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result?.createTransfer;
  }

  /**
   * fetch Transfer
   *
   * @param args.id Transfer ID
   * @returns
   */
  async fetchTransfer(args: { id: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: fetchTransferQuery,
      variables: {
        id: args.id,
      },
      requestHeaders: {
        'x-hasura-trans-id': args.id,
      },
    });

    return result?.transferCreated;
  }

  /**
   * Claim Transfer
   *
   * @param args.transferParam Transfer Param
   * @returns
   */
  async claimTransfer(args: { transferParam: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: claimTransferQuery,
      variables: {
        transferParam: args.transferParam,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return result?.claimTransfer;
  }

  /**
   * fetch order list
   *
   * @param args.walletUserId
   * @param args.limit
   * @param args.offset
   *
   * @returns
   */
  async fetchOrderList(fetchParams?: PaginationSettings & { status: ORDER_STATUS[] }) {
    this.checkInitialized();
    this.checkJWTToken();

    const { limit = 10, offset = 0, status = [ORDER_STATUS.SUCCESS] } = fetchParams || {};
    console.log(status);

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: fetchOrderListQuery,
      variables: {
        walletUserId: this.userId,
        limit,
        offset,
      },
      requestHeaders: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    });

    return {
      data: result?.order.map((order: any) => {
        let payloadStruct = {};
        try {
          payloadStruct = JSON.parse(window.atob(order.payload));
        } catch (error) {
          console.error(error);
        }

        return {
          ...order,
          payload: payloadStruct,
        };
      }),
      pagination: {
        total: result?.orderAggregate.aggregate.count,
        limit,
        offset,
      },
    };
  }
}

