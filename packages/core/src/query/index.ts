import { gql } from 'graphql-request';

/**
 * For login
 */
export const LoginMutation = gql`
  mutation LoginMutation($appId: String = "", $initData: String = "") {
    tgLogin(appId: $appId, initData: $initData)
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
 * For creating order
 */
export const createTransferQuery = gql`
  mutation transferQuery($amount: Float = 0, $expirationAt: Float = 0) {
    createTransfer(amount: $amount, expirationAt: $expirationAt)
  }
`;

/**
 * For fetching transfer
 */
export const fetchTransferQuery = gql`
  query fetchTransferQuery($id: uuid = "") {
    transferCreated(where: { id: { _eq: $id } }) {
      id
      walletUserId
      isRefund
      totalAmount
      totalCount
      expirationAt
      createdAt
      transfer_claimeds {
        walletUserId
        createdAt
      }
      transferClaimedsAggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

/**
 * For claim transfer
 */
export const claimTransferQuery = gql`
  mutation claimTransferQuery($transferId: String = "") {
    claimTransfer(transferId: $transferId)
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

