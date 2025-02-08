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
  
      const switchState = this._switchState || "off";
      const kwhValue = this._kwhValue || "0";
  
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
            cursor: pointer;
          }
          .left {
            display: flex;
            align-items: center;
          }
          .right {
            display: flex;
            align-items: center;
          }
          ha-icon {
            margin-right: 8px;
          }
          .kwh {
            font-size: 1.2em;
            font-weight: bold;
          }
          .toggle-button {
            width: 40px;
            height: 20px;
            background-color: ${switchState === "on" ? "green" : "red"};
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: ${switchState === "on" ? "flex-end" : "flex-start"};
            padding: 2px;
            cursor: pointer;
          }
          .toggle-circle {
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
          }
        </style>
        <ha-card>
          <div class="card">
            <div class="left">
              <ha-icon icon="mdi:power"></ha-icon>
              <div class="toggle-button" id="toggle">
                <div class="toggle-circle"></div>
              </div>
            </div>
            <div class="right">
              <ha-icon icon="mdi:flash"></ha-icon>
              <span class="kwh">${kwhValue} kWh</span>
            </div>
          </div>
        </ha-card>
      `;
  
      // Add event listener for toggle button
      this.shadowRoot.getElementById("toggle").addEventListener("click", () => {
        this._toggleSwitch();
      });
    }
  
    set hass(hass) {
      if (!this.config) return;
  
      this.hass = hass;
      this._switchState = hass.states[this.config.entity_switch]?.state || "off";
      this._kwhValue = hass.states[this.config.entity_kwh]?.state || "0";
  
      this.render();
    }
  
    _toggleSwitch() {
      if (!this.hass || !this.config.entity_switch) return;
  
      const turnOn = this._switchState === "off";
      this.hass.callService("switch", turnOn ? "turn_on" : "turn_off", {
        entity_id: this.config.entity_switch,
      });
  
      // Optimistically update UI before the state updates
      this._switchState = turnOn ? "on" : "off";
      this.render();
    }
  
    getCardSize() {
      return 1;
    }
  }
  
  customElements.define("dual-sensor-card", DualSensorCard);