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
    `;
  }

  render() {
    if (!this.config || !this.hass) {
      return html``;
    }

    const switchEntity = this.config.switch_entity ? this.hass.states[this.config.switch_entity] : null;
    const sensorEntity = this.config.sensor_entity ? this.hass.states[this.config.sensor_entity] : null;

    const switchState = switchEntity ? switchEntity.state : 'unavailable';
    const sensorState = sensorEntity ? sensorEntity.state : 'unavailable';
    const lastUpdated = sensorEntity ? new Date(sensorEntity.last_updated).toLocaleTimeString() : 'unavailable';

    return html`
      <div class="card-content">
        ${this.config.show_icon ? html`<ha-icon class="icon" .icon=${this.config.icon || 'mdi:lightbulb'}></ha-icon>` : ''}
        ${this.config.show_state ? html`<div class="state">${switchState}</div>` : ''}
        <div class="state">${sensorState}</div>
        <div class="last-updated">Last updated: ${lastUpdated}</div>
      </div>
    `;
  }

  setConfig(config) {
    if (!config.switch_entity || !config.sensor_entity) {
      throw new Error('Please define both switch_entity and sensor_entity');
    }
    this.config = {
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
        <div class="config-label">Switch Entity:</div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.switch_entity}
          @value-changed=${this._valueChanged}
          .configValue=${'switch_entity'}
        ></ha-entity-picker>
      </div>
      <div class="config-row">
        <div class="config-label">Sensor Entity:</div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this.config.sensor_entity}
          @value-changed=${this._valueChanged}
          .configValue=${'sensor_entity'}
        ></ha-entity-picker>
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

customElements.define('dual-sensor-card', DualSensorCard);
customElements.define('dual-sensor-card-editor', DualSensorCardEditor);