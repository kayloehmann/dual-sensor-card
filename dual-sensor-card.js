class DualSensorCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    setConfig(config) {
      if (!config.entity_switch || !config.entity_kwh) {
        throw new Error("You need to define both entity_switch and entity_kwh.");
      }
      this.config = config;
      this.render();
    }
  
    render() {
      if (!this.shadowRoot) return;
  
      this.shadowRoot.innerHTML = `
        <style>
          .card {
            padding: 16px;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: var(--card-background-color);
            border-radius: 8px;
            box-shadow: var(--ha-card-box-shadow);
          }
          .left {
            display: flex;
            align-items: center;
          }
          ha-icon {
            margin-right: 8px;
          }
          .right {
            display: flex;
            align-items: center;
          }
          .kwh {
            font-size: 1.2em;
            font-weight: bold;
          }
        </style>
        <ha-card>
          <div class="card">
            <div class="left">
              <ha-icon icon="mdi:power"></ha-icon>
              <ha-entity-toggle entity="${this.config.entity_switch}"></ha-entity-toggle>
            </div>
            <div class="right">
              <ha-icon icon="mdi:flash"></ha-icon>
              <span class="kwh">${this._kwhValue || '0'} kWh</span>
            </div>
          </div>
        </ha-card>
      `;
    }
  
    set hass(hass) {
      if (!this.config) return;
  
      this._kwhValue = hass.states[this.config.entity_kwh]?.state || '0';
      this.render();
    }
  
    getCardSize() {
      return 1;
    }
  }
  
  customElements.define("dual-sensor-card", DualSensorCard);