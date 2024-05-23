/**
 * @license
 * Copyright 2024 Mizu
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './components/MizuButton';

// TODO:

// 1. Create a new LitElement called MizuConnectButton
// 2. click
@customElement('mizu-connect-button')
export class MizuConnectButton extends LitElement {
  @property()
  btnText? = 'Connect';

  private _log() {
    const modal = document.querySelector('mizu-connect-modal');
    modal!.open = true;
  }

  render() {
    return html`
      <button @click=${this._log}>${this.btnText}</button>
      <mizu-button @click=${this._log}>mizubtton333eee</mizu-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mizu-connect-button': MizuConnectButton;
  }
}

