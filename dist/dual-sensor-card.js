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

    const friendlyName = sensorEntity.attributes.friendly_name || 'Dual Sensor';
    const icon = this.config.icon || 'mdi:lightbulb';

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    height: 100%;
                }
                .card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    border-radius: 8px;
                    background-color: var(--card-background-color, white);
                    box-shadow: var(--ha-card-box-shadow, none);
                    font-family: Arial, sans-serif;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }
                .info {
                    flex-grow: 1;
                    text-align: left;
                    display: flex;
                    align-items: center;
                }
                .icon {
                    font-size: 24px;
                    margin-right: 8px;
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
                    <ha-icon class="icon" icon="${icon}"></ha-icon>
                    <div>
                        <div class="title">${friendlyName}</div>
                        <div class="value">${sensorEntity.state} ${sensorEntity.attributes.unit_of_measurement || ''}</div>
                    </div>
                </div>
                <div class="toggle ${switchEntity.state === 'on' ? '' : 'off'}" id="toggle-switch">
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
      icon: "mdi:lightbulb"
    };
  }
}

customElements.define('dual-sensor-card', DualSensorCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "dual-sensor-card",
  name: "Dual Sensor Card",
  preview: false,
  description: "A card to display a switch and a sensor value."
});

class DualSensorCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    this.config = { ...config };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._hass) return;

    const entities = Object.keys(this._hass.states).filter(
      (entity) => entity.startsWith('switch.') || entity.startsWith('sensor.')
    );

    this.shadowRoot.innerHTML = `
            <style>
                .editor {
                    padding: 16px;
                }
                label {
                    display: block;
                    margin-bottom: 8px;
                }
                select, input {
                    width: 100%;
                    padding: 4px;
                }
            </style>
            <div class="editor">
                <label>Switch Entity:</label>
                <select id="switch_entity">
                    ${entities.filter(e => e.startsWith('switch.')).map(e => `<option value="${e}" ${this.config.switch_entity === e ? 'selected' : ''}>${e}</option>`).join('')}
                </select>
                
                <label>Sensor Entity:</label>
                <select id="sensor_entity">
                    ${entities.filter(e => e.startsWith('sensor.')).map(e => `<option value="${e}" ${this.config.sensor_entity === e ? 'selected' : ''}>${e}</option>`).join('')}
                </select>
            </div>
        `;

    this.shadowRoot.querySelector('#switch_entity').addEventListener('change', (event) => this.updateConfig(event, 'switch_entity'));
    this.shadowRoot.querySelector('#sensor_entity').addEventListener('change', (event) => this.updateConfig(event, 'sensor_entity'));
  }

  updateConfig(event, key) {
    if (!this.config) return;
    this.config = { ...this.config, [key]: event.target.value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
  }
}

customElements.define('dual-sensor-card-editor', DualSensorCardEditor);
