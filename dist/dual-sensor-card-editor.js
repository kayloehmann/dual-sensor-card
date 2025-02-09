import { LitElement, html } from 'lit';
import { localize } from './localize.js';

export class DualSensorCardEditor extends LitElement {
  setConfig(config) {
    this._config = config;
  }

  static get properties() {
    return {
      hass: Object,
      _config: Object,
    };
  }

  get _entity_switch() {
    return this._config.entity_switch || '';
  }

  get _entity_kwh() {
    return this._config.entity_kwh || '';
  }

  get _show_state() {
    return this._config.show_state !== false;
  }

  get _show_icon() {
    return this._config.show_icon !== false;
  }

  get _icon_height() {
    return this._config.icon_height || '40px';
  }

  configChanged(newConfig) {
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass) return html``;

    return html`
      <div class="card-config">
        <div class="side-by-side">
          <ha-entity-picker
            .label=${localize('editor.switch_entity')}
            .value=${this._entity_switch}
            .configValue=${'entity_switch'}
            @change=${this._valueChanged}
            .hass=${this.hass}
            allow-custom-entity
          ></ha-entity-picker>
          <ha-entity-picker
            .label=${localize('editor.sensor_entity')}
            .value=${this._entity_kwh}
            .configValue=${'entity_kwh'}
            @change=${this._valueChanged}
            .hass=${this.hass}
            allow-custom-entity
          ></ha-entity-picker>
        </div>
        <div class="side-by-side">
          <paper-input
            label="${localize('editor.icon_height')}"
            .value=${this._icon_height}
            .configValue=${'icon_height'}
            @value-changed=${this._valueChanged}
          ></paper-input>
          <ha-formfield
            .label=${localize('editor.show_state')}
            .configValue=${'show_state'}
          >
            <ha-switch
              .checked=${this._show_state}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield
            .label=${localize('editor.show_icon')}
            .configValue=${'show_icon'}
          >
            <ha-switch
              .checked=${this._show_icon}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this._config) return;
    const target = ev.target;
    if (target.configValue) {
      this._config = {
        ...this._config,
        [target.configValue]: target.checked !== undefined ? target.checked : target.value,
      };
    }
    this.configChanged(this._config);
  }
}

customElements.define('dual-sensor-card-editor', DualSensorCardEditor);