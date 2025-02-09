import { LitElement, html, css } from 'lit';
import { styles } from './styles.js';

class DualSensorCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  static get styles() {
    return css`
      ${styles}
      :host {
        display: block;
        position: relative;
        padding: var(--ha-card-padding, 12px);
        min-height: 100px;
      }
      .container {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 12px;
      }
      .icon {
        color: rgba(var(--rgb-state-icon-color), 1);
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      .content {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .name {
        font-size: 16px;
        color: var(--primary-text-color);
        font-weight: normal;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .state {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin: 4px 0 0;
      }
      .updated {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
    `;
  }

  constructor() {
    super();
    this._toggleSwitch = this._toggleSwitch.bind(this);
  }

  setConfig(config) {
    if (!config.entity_switch || !config.entity_kwh) {
      throw new Error('Entities müssen definiert sein');
    }
    this.config = {
      show_state: true,
      show_icon: true,
      icon_height: '40px',
      ...config,
    };
  }

  _toggleSwitch() {
    this.hass.callService('homeassistant', 'toggle', {
      entity_id: this.config.entity_switch,
    });
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const switchEntity = this.hass.states[this.config.entity_switch];
    const sensorEntity = this.hass.states[this.config.entity_kwh];

    if (!switchEntity || !sensorEntity) return html`<ha-card>Entities not found</ha-card>`;

    const lastUpdated = new Date(sensorEntity.last_updated).toLocaleTimeString();

    return html`
      <ha-card>
        <div class="container">
          ${this.config.show_icon ? html`
            <div 
              class="icon"
              style="height: ${this.config.icon_height}"
              @click=${this._toggleSwitch}
            >
              <ha-icon .icon=${switchEntity.attributes.icon || 'mdi:power'}></ha-icon>
            </div>
          ` : ''}
          <div class="content">
            <div class="name">${switchEntity.attributes.friendly_name}</div>
            ${this.config.show_state ? html`
              <div class="state">
                ${sensorEntity.state} ${sensorEntity.attributes.unit_of_measurement || ''}
              </div>
            ` : ''}
            <div class="updated">Letzte Aktualisierung: ${lastUpdated}</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('dual-sensor-card', DualSensorCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'dual-sensor-card',
  name: 'Dual Sensor Card',
  preview: true,
  description: 'Kombinierte Switch- und Sensor-Karte mit Anpassungsoptionen',
});