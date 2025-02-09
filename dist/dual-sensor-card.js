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

    const friendlyName = this.config.name || sensorEntity.attributes.friendly_name || 'Dual Sensor';
    const icon = this.config.icon || 'mdi:lightbulb';
    const showState = this.config.show_state !== false;
    const showIcon = this.config.show_icon !== false;
    const iconSize = this.config.icon_size || '24px';
    const tapAction = this.config.tap_action || 'toggle';
    const holdAction = this.config.hold_action || 'more-info';
    const lastUpdated = new Date(sensorEntity.last_updated).toLocaleString();

    const switchState = switchEntity.state === 'on';
    const sensorValue = `${sensorEntity.state} ${sensorEntity.attributes.unit_of_measurement || ''}`;

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                .card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-radius: 8px;
                    background-color: var(--card-background-color, white);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    box-shadow: var(--ha-card-box-shadow, none);
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                .icon {
                    font-size: ${iconSize};
                    color: var(--state-icon-color, #44739e);
                    display: ${showIcon ? 'block' : 'none'};
                }
                .title {
                    font-size: 16px;
                    font-weight: bold;
                }
                .value {
                    font-size: 14px;
                    color: var(--primary-text-color);
                    display: ${showState ? 'block' : 'none'};
                }
                .last-updated {
                    font-size: 12px;
                    color: var(--secondary-text-color, grey);
                    margin-top: 4px;
                }
                .toggle {
                    margin-top: 10px;
                    cursor: pointer;
                    background: ${switchState ? 'var(--switch-checked-color, green)' : 'var(--switch-unchecked-color, grey)'};
                    border-radius: 16px;
                    width: 40px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    padding: 2px;
                    transition: background 0.3s;
                }
                .toggle .handle {
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s;
                    transform: translateX(${switchState ? '20px' : '0'});
                }
            </style>
            <div class="card" @click="this.handleTap()" @contextmenu="this.handleHold(event)">
                <ha-icon class="icon" icon="${icon}"></ha-icon>
                <div class="title">${friendlyName}</div>
                <div class="value">${sensorValue}</div>
                <div class="last-updated">Zuletzt aktualisiert: ${lastUpdated}</div>
                <div class="toggle" id="toggle-switch">
                    <div class="handle"></div>
                </div>
            </div>
        `;

    this.shadowRoot.querySelector('#toggle-switch').addEventListener('click', () => this.toggleSwitch());
  }

  toggleSwitch() {
    if (!this._hass || !this.config.switch_entity) return;
    this._hass.callService('switch', 'toggle', {
      entity_id: this.config.switch_entity
    });
  }

  handleTap() {
    this._hass.callService('homeassistant', this.config.tap_action, {
      entity_id: this.config.switch_entity
    });
  }

  handleHold(event) {
    event.preventDefault();
    this._hass.callService('homeassistant', this.config.hold_action, {
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

  static getConfigElement() {
    return document.createElement('dual-sensor-card-editor');
  }

  static getStubConfig() {
    return {
      switch_entity: "switch.example",
      sensor_entity: "sensor.example",
      icon: "mdi:lightbulb",
      show_state: true,
      show_icon: true,
      icon_size: "24px",
      tap_action: "toggle",
      hold_action: "more-info"
    };
  }
}

customElements.define('dual-sensor-card', DualSensorCard);
