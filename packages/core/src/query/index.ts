import { gql } from 'graphql-request';

/**
 * For login
 */
export const TGLoginMutation = gql`
  mutation TGLoginMutation($appId: String = "", $initData: String = "") {
    tgLogin(appId: $appId, initData: $initData)
  }
`;

export const TGWidgetLoginMutation = gql`
  mutation tgWidgetLoginMutation($appId: String = "", $authData: String = "") {
    tgWidgetLogin(appId: $appId, authData: $authData)
  }
`;

/**
 * For getting user by TG ID
 */
export const CheckUserIsExistQueryByTgId = gql`
  query CheckUserIsExistQueryByTgId {
    telegramUser {
      walletUserId
      tgId
    }
  }
`;

/**
 * For getting user wallet address
 */
export const UserWalletAddressQuery = gql`
  query UserWalletAddressQuery($id: uuid = "") {
    walletUserByPk(id: $id) {
      sub_wallets {
        address
      }
    }
  }
`;

/**
 * For creating order
 */
export const createOrderQuery = gql`
  mutation CreateOrderQuery($appId: String = "", $payload: String = "") {
    createOrder(appId: $appId, payload: $payload)
  }
`;

/**
 * For simulate order
 */
export const simulateOrderQuery = gql`
  query simulateOrderQuery($payload: String = "") {
    simulateOrder(payload: $payload)
  }
`;

/**
 * Confirm order
 */
export const confirmOrderQuery = gql`
  mutation confirmOrderQuery($orderId: String = "") {
    confirmOrder(orderId: $orderId)
  }
`;

/**
 * Fetch order list
 */
export const fetchOrderListQuery = gql`
  query fetchOrderListQuery(
    $walletUserId: uuid = ""
    $limit: Int = 10
    $offset: Int = 0
    $status: [Int] = []
  ) {
    order(
      where: { walletUserId: { _eq: $walletUserId } }
      limit: $limit
      offset: $offset
      orderBy: { createdAt: DESC }
    ) {
      applicationId
      createdAt
      id
      payload
      status
      transactionSeqNo
      type
      updatedAt
      walletUserId
      transactions {
        hash
        gasFee
        createdAt
        status
        type
      }
    }
    orderAggregate(where: { walletUserId: { _eq: $walletUserId } }) {
      aggregate {
        count
      }
    }
  }
`;

/**
 * Bind Google
 */
export const bindGoogleQuery = gql`
  mutation bindGoogleQuery($address: String = "", $idToken: String = "") {
    googleBind(address: $address, idToken: $idToken)
  }
`;

