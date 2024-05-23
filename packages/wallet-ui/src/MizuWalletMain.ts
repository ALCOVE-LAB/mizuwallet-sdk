import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mizu-wallet-main')
export class MizuWalletMain extends LitElement {
  // balance.
  // address
  // advs
  //

  render() {
    return html`
      <div>Main ok</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mizu-wallet-main': MizuWalletMain;
  }
}

