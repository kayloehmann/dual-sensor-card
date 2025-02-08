import { LitElement, html, css } from "lit";

class DualSensorCard extends LitElement {
  static properties = {
    hass: { type: Object },
    config: { type: Object },
    _switchState: { type: String },
    _kwhValue: { type: String },
  };

  static styles = css`
    .card {
      padding: 16px;
      font-family: Arial, sans-serif;
      background-color: var(--ha-card-background, white);
      border-radius: 8px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
    }
    .header {
      font-size: 1.2em;
      font-weight: bold;
      text-align: center;
      padding-bottom: 10px;
      color: var(--primary-text-color);
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .left, .right {
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
      background-color: var(--switch-color, red);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 2px;
      cursor: pointer;
    }
    .toggle-button.on {
      background-color: green;
      justify-content: flex-end;
    }
    .toggle-circle {
      width: 16px;
      height: 16px;
      background-color: white;
      border-radius: 50%;
    }
  `;

  constructor() {
    super();
    this._switchState = "off";
    this._kwhValue = "0";
  }

  setConfig(config) {
    if (!config.entity_switch || !config.entity_kwh) {
      throw new Error("You need to define both entity_switch and entity_kwh.");
    }
    this.config = config;
  }

  set hass(hass) {
    if (!this.config || !hass) return;
    
    this.hass = hass;

    const switchEntity = hass.states[this.config.entity_switch];
    const kwhEntity = hass.states[this.config.entity_kwh];

    if (!switchEntity || !kwhEntity) {
      console.error(`DualSensorCard: Missing entity ${this.config.entity_switch} or ${this.config.entity_kwh}`);
      return;
    }

    this._switchState = switchEntity.state || "off";
    this._kwhValue = kwhEntity.state || "0";
    this.requestUpdate();
  }

  _toggleSwitch() {
    if (!this.hass || !this.config.entity_switch) return;

    const turnOn = this._switchState === "off";
    const domain = this.config.entity_switch.startsWith("light.") ? "light" : "switch";

    this.hass.callService(domain, turnOn ? "turn_on" : "turn_off", {
      entity_id: this.config.entity_switch,
    }).then(() => {
      this._switchState = turnOn ? "on" : "off";
      this.requestUpdate();
    }).catch((error) => {
      console.error("DualSensorCard: Error toggling switch:", error);
    });
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const switchEntity = this.hass.states[this.config.entity_switch];
    const switchName = switchEntity?.attributes?.friendly_name || this.config.name || this.config.entity_switch;

    return html`
      <ha-card class="card">
        <div class="header">
          <span class="title">${switchName}</span>
        </div>
        <div class="content">
          <div class="left">
            <ha-icon icon="mdi:power"></ha-icon>
            <div class="toggle-button ${this._switchState}" @click="${() => this._toggleSwitch()}">
              <div class="toggle-circle"></div>
            </div>
          </div>
          <div class="right">
            <ha-icon icon="mdi:flash"></ha-icon>
            <span class="kwh">${this._kwhValue} kWh</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("dual-sensor-card", DualSensorCard);