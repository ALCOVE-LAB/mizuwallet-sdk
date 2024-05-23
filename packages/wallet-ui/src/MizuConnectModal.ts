/**
 * @license
 * Copyright 2024 Mizu
 * SPDX-License-Identifier: MIT
 */

import { LitElement, css, html } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('mizu-connect-modal')
export class MizuConnectModal extends LitElement {
  static styles = css`
    @unocss-placeholder;
  `;

  /**
   * Copy for the read the docs hint.
   */
  @property({
    type: String,
    attribute: 'docs-hint',
    reflect: true,
  })
  docsHint = 'Click on the Vite and Lit logos to learn more';

  @property({
    type: Boolean,
    attribute: 'stuck-window',
    reflect: true,
  })
  stuckWindow = false;

  @property({
    type: Boolean,
  })
  private _open = false;
  get open() {
    return this._open;
  }
  set open(value: boolean) {
    const oldValue = this._open;
    this._open = value;
    this._updateWindowStatus(value, oldValue);
    this.requestUpdate('open', oldValue);
  }

  private _updateWindowStatus = (newVal: boolean, oldVal: boolean) => {
    if (newVal != oldVal && this.stuckWindow) {
      document.body.style.overflow = newVal ? 'hidden' : 'auto';
      return true;
    }
    return false;
  };

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  render() {
    return html`
      <div
        fixed
        top-0
        left-0
        right-0
        left-0
        bottom-0
        z-1000
        invisible
        flex-col-center
        class="${classMap({
          '!visible': this._open,
        })}"
      >
        <!-- overlap -->
        <!-- todo: backdrop blur -->
        <div
          absolute
          left-0
          top-0
          bottom-0
          right-0
          w-full
          h-screen
          class="bg-black/10"
          @click=${this._onClick}
        ></div>
        <div
          opacity-0
          z-10
          transition-all
          invisible
          -translate-y-20
          duration-200
          max-w-520px
          w-full
          px-4
          box-border
          class="sm:px-0 ${classMap({
            '!visible': this._open,
            '!opacity-100': this._open,
            '!translate-y-0': this._open,
          })}"
        >
          <div bg-white rounded-md w-full shadow-xl>
            <a href="https://vitejs.dev" target="_blank">1</a>
            <a href="https://lit.dev" target="_blank">2</a>
            <div class="card">
              <button @click=${this._onClick} part="button">count is ${this.count}</button>
            </div>
            <p class="read-the-docs">${this.docsHint}</p>
          </div>
        </div>
      </div>
    `;
  }

  private _onClick() {
    this.open = !this.open;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mizu-connect-modal': MizuConnectModal;
  }
}

