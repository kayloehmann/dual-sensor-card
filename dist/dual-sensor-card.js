import { LitElement, html, css } from 'https://unpkg.com/lit-element/lit-element.js?module';
import { styleMap } from 'https://unpkg.com/lit-html/directives/style-map.js?module';

class DualSensorCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        padding: 16px;
        background-color: var(--card-background-color);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .icon {
        color: var(--paper-item-icon-color);
        margin-bottom: 8px;
      }
      .state {
        font-size: 1.2em;
        margin-bottom: 8px;
      }
      .last-updated {
        font-size: 0.8em;
        color: var(--secondary-text-color);
      }
      .friendly-name {
        font-size: 1.1em;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .label {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
      }
    `;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const switchEntity = this.config.entity_switch ? this.hass.states[this.config.entity_switch] : null;
    const sensorEntity = this.config.entity_kwh ? this.hass.states[this.config.entity_kwh] : null;

    const switchState = switchEntity ? switchEntity.state : 'unavailable';
    const sensorState = sensorEntity ? sensorEntity.state : 'unavailable';
    const lastUpdated = sensorEntity ? new Date(sensorEntity.last_updated).toLocaleTimeString() : 'unavailable';
    const friendlyName = switchEntity ? switchEntity.attributes.friendly_name : 'Unavailable';

    return html`
      <div class="card-content">
        ${this.config.show_friendly_name ? html`<div class="friendly-name">${friendlyName}</div>` : ''}
        ${this.config.show_icon ? html`<ha-icon class="icon" .icon=${this.config.icon || 'mdi:lightbulb'}></ha-icon>` : ''}
        ${this.config.show_state ? html`<div class="state">Switch: ${switchState}</div>` : ''}
        <div class="label">Sensor Value:</div>
        <div class="state">${sensorState}</div>
        <div class="last-updated">Last updated: ${lastUpdated}</div>
      </div>
    `;
  }

  setConfig(config) {
    if (!config.entity_switch || !config.entity_kwh) {
      throw new Error('Please define both entity_switch and entity_kwh');
    }
    this.config = {
      show_friendly_name: true,
      show_icon: true,
      show_state: true,
      icon: 'mdi:lightbulb',
      ...config,
    };
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement('dual-sensor-card-editor');
  }
}

class DualSensorCardEditor extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  static get styles() {
    return css`
      .config-row {
        margin-bottom: 16px;
      }
      .config-label {
        font-weight: bold;
      }
    `;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="config-row">
        <div class="config-label">Switch Entity (entity_switch):</div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entity_switch}
          @value-changed=${this._valueChanged}
          .configValue=${'entity_switch'}
        ></ha-entity-picker>
      </div>
      <div class="config-row">
        <div class="config-label">Sensor Entity (entity_kwh):</div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.entity_kwh}
          @value-changed=${this._valueChanged}
          .configValue=${'entity_kwh'}
        ></ha-entity-picker>
      </div>
      <div class="config-row">
        <div class="config-label">Show Friendly Name:</div>
        <ha-switch
          .checked=${this.config.show_friendly_name}
          @change=${this._valueChanged}
          .configValue=${'show_friendly_name'}
        ></ha-switch>
      </div>
      <div class="config-row">
        <div class="config-label">Show Icon:</div>
        <ha-switch
          .checked=${this.config.show_icon}
          @change=${this._valueChanged}
          .configValue=${'show_icon'}
        ></ha-switch>
      </div>
      <div class="config-row">
        <div class="config-label">Show State:</div>
        <ha-switch
          .checked=${this.config.show_state}
          @change=${this._valueChanged}
          .configValue=${'show_state'}
        ></ha-switch>
      </div>
      <div class="config-row">
        <div class="config-label">Icon:</div>
        <ha-icon-picker
          .value=${this.config.icon}
          @value-changed=${this._valueChanged}
          .configValue=${'icon'}
        ></ha-icon-picker>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this.config) {
      return;
    }
    const target = ev.target;
    const value = target.checked !== undefined ? target.checked : target.value;
    const configValue = target.configValue;
    this.config = {
      ...this.config,
      [configValue]: value,
    };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
  }
}

if (!customElements.get('dual-sensor-card')) {
  customElements.define('dual-sensor-card', DualSensorCard);
}
if (!customElements.get('dual-sensor-card-editor')) {
  customElements.define('dual-sensor-card-editor', DualSensorCardEditor);
}