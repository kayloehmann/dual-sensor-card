// dual-sensor-card.js
import { LitElement, html, css } from 'lit';

class DualSensorCard extends LitElement {
  static properties = {
    hass: {},
    config: {},
  };

  static styles = css`
    .card {
      padding: 16px;
    }
    .sensor {
      margin-bottom: 8px;
    }
  `;

  setConfig(config) {
    if (!config.entity_1 || !config.entity_2) {
      throw new Error("You need to define entity_1 and entity_2");
    }
    this.config = config;
  }

  render() {
    const state1 = this.hass.states[this.config.entity_1];
    const state2 = this.hass.states[this.config.entity_2];
    if (!state1 || !state2) return html`<ha-card>Entities not found</ha-card>`;

    return html`
      <ha-card header="${this.config.title || 'Dual Sensor'}">
        <div class="card">
          <div class="sensor">${state1.attributes.friendly_name || this.config.entity_1}: ${state1.state} ${state1.attributes.unit_of_measurement || ''}</div>
          <div class="sensor">${state2.attributes.friendly_name || this.config.entity_2}: ${state2.state} ${state2.attributes.unit_of_measurement || ''}</div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define('dual-sensor-card', DualSensorCard);
