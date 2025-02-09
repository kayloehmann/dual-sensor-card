class DualSensorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    if (!this.config) return;

    this._hass = hass;
    const switchEntity = hass.states[this.config.switch_entity];
    const sensorEntity = hass.states[this.config.sensor_entity];

    if (!switchEntity || !sensorEntity) return;

    this.shadowRoot.innerHTML = `
            <style>
                .card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-radius: 8px;
                    background-color: var(--card-background-color, white);
                    box-shadow: var(--ha-card-box-shadow, none);
                    font-family: Arial, sans-serif;
                }
                .info {
                    flex-grow: 1;
                    text-align: left;
                }
                .title {
                    font-size: 16px;
                    font-weight: normal;
                }
                .value {
                    font-size: 14px;
                    color: var(--primary-text-color);
                    font-weight: normal;
                }
                .toggle {
                    cursor: pointer;
                    background: var(--switch-checked-color, green);
                    border-radius: 16px;
                    width: 40px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    padding: 2px;
                    transition: background 0.3s;
                }
                .toggle.off {
                    background: var(--switch-unchecked-color, grey);
                }
                .toggle .handle {
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s;
                    transform: translateX(${switchEntity.state === 'on' ? '20px' : '0'});
                }
            </style>
            <div class="card">
                <div class="info">
                    <div class="title">${this.config.name || 'Dual Sensor'}</div>
                    <div class="value">${sensorEntity.state} ${sensorEntity.attributes.unit_of_measurement || ''}</div>
                </div>
                <div class="toggle ${switchEntity.state === 'on' ? '' : 'off'}" @click="this.toggleSwitch()">
                    <div class="handle"></div>
                </div>
            </div>
        `;
  }

  toggleSwitch() {
    if (!this._hass || !this.config.switch_entity) return;

    this._hass.callService('switch', 'toggle', {
      entity_id: this.config.switch_entity
    });
  }

  setConfig(config) {
    if (!config.switch_entity || !config.sensor_entity) {
      throw new Error("You need to define both switch_entity and sensor_entity");
    }
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('dual-sensor-card', DualSensorCard);