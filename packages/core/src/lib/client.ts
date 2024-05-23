import { Network } from '@aptos-labs/ts-sdk';
import request from 'graphql-request';
import { jwtDecode } from 'jwt-decode';
import {
  CheckUserIsExistQueryByTgId,
  LoginMutation,
  UserWalletAddressQuery,
  claimTransferQuery,
  confirmOrderQuery,
  createOrderQuery,
  createTransferQuery,
  fetchOrderListQuery,
  fetchTransferQuery,
  simulateOrderQuery,
} from '../query';
import { ORDER_STATUS } from './config/enum';

export const GRAPHQL_URL: Record<'mainnet' | 'testnet', string> = {
  testnet: 'https://hasura-wallet.groupwar.xyz/v1/graphql',
  mainnet: 'https://hasura.alcove.pro/v1/graphql',
};

export type JWTToken = string;

const SEC_IN_72_HOURS = 3600 * 72;

interface PaginationSettings {
  limit?: number;
  offset?: number;
}

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

    /**
     * Decode JWT Token
     */
    const decoded: any = jwtDecode(result.tgLogin);

    // Check if token is expired
    if (decoded?.exp < Date.now() / 1000) {
      this.logout();
      throw new Error('Token expired');
    }

    // Check if token has user id
    // If yes, set userId and jwtToken
    if (decoded?.['https://hasura.io/jwt/claims']?.['x-hasura-user-id']) {
      this.userId = decoded['https://hasura.io/jwt/claims']['x-hasura-user-id'];
      this.jwtToken = result.tgLogin;
      //   console.log(this.userId, this.jwtToken);
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
   *
   * @returns
   */
  async createTransfer(args: { amount: number }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: createTransferQuery,
      variables: {
        amount: Math.floor(args.amount),
        expirationAt: Math.floor(Date.now() / 1000) + SEC_IN_72_HOURS,
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
   * @param args.transferId Transfer ID
   * @returns
   */
  async claimTransfer(args: { transferId: string }) {
    this.checkInitialized();
    this.checkJWTToken();

    const result: any = await request({
      url: this.graphqlEndPoint,
      document: claimTransferQuery,
      variables: {
        transferId: args.transferId,
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

