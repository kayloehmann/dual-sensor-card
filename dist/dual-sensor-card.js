class DualSensorCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.icons = [];
    this.fetchIcons();
  }

  async fetchIcons() {
    const response = await fetch("https://mdi.bessarabov.com/api/v1/icons");
    if (response.ok) {
      const data = await response.json();
      this.icons = data.icons.map(icon => `mdi:${icon.name}`);
      this.render();
    }
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
                <select id="switch_entity" onchange="this.updateConfig(event, 'switch_entity')">
                    ${entities.filter(e => e.startsWith('switch.')).map(e => `<option value="${e}" ${this.config.switch_entity === e ? 'selected' : ''}>${e}</option>`).join('')}
                </select>
                
                <label>Sensor Entity:</label>
                <select id="sensor_entity" onchange="this.updateConfig(event, 'sensor_entity')">
                    ${entities.filter(e => e.startsWith('sensor.')).map(e => `<option value="${e}" ${this.config.sensor_entity === e ? 'selected' : ''}>${e}</option>`).join('')}
                </select>
                
                <label>Icon:</label>
                <select id="icon" onchange="this.updateConfig(event, 'icon')">
                    ${this.icons.length > 0 ? this.icons.map(icon => `<option value="${icon}" ${this.config.icon === icon ? 'selected' : ''}>${icon}</option>`).join('') : '<option>Loading...</option>'}
                </select>
            </div>
        `;
  }

  updateConfig(event, key) {
    this.config[key] = event.target.value;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
  }
}

customElements.define('dual-sensor-card-editor', DualSensorCardEditor);
