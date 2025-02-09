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
        
        <!-- Weitere Editor-Elemente hier -->
      </div>
    `;
    }

    _valueChanged(ev) {
        if (!this._config) return;
        const target = ev.target;
        if (target.configValue) {
            this._config = {
                ...this._config,
                [target.configValue]: target.value || '',
            };
        }
        this.configChanged(this._config);
    }
}

customElements.define('dual-sensor-card-editor', DualSensorCardEditor);