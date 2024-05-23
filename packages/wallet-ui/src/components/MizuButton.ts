/**
 * @license
 * Copyright 2024 Mizu
 * SPDX-License-Identifier: MIT
 */

import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mizu-button')
export class MizuButton extends LitElement {
  static styles = css`
    @unocss-placeholder;
  `;

  constructor() {
    super();
  }

  render() {
    return html`
      <div
        inline
        p="x-2 y-1"
        text="sm"
        bg="primary"
        border="2 solid black"
        rounded="md"
        transition="all"
        duration="100"
        top="0"
        left="0"
        relative
        active="top-1 left-1"
        cursor="pointer"
        select="none"
        class=""
      >
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mizu-button': MizuButton;
  }
}

