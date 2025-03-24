declare module 'khalti-checkout-web' {
  interface KhaltiOnSuccessPayload {
    amount: number;
    mobile: string;
    product_identity: string;
    product_name: string;
    token: string;
  }

  interface KhaltiEventHandler {
    onSuccess(payload: KhaltiOnSuccessPayload): void;
    onError?(error: any): void;
    onClose?(): void;
  }

  interface KhaltiConfig {
    publicKey: string;
    productIdentity: string;
    productName: string;
    productUrl: string;
    eventHandler: KhaltiEventHandler;
    paymentPreference?: string[];
  }

  interface ShowOptions {
    amount: number; // amount in paisa
  }

  export default class KhaltiCheckout {
    constructor(config: KhaltiConfig);
    show(options: ShowOptions): void;
  }
}

