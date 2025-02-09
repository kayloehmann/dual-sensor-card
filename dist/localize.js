export function localize(string) {
  const translations = {
    'editor.switch_entity': 'Switch Entity',
    'editor.sensor_entity': 'Sensor Entity',
    'editor.icon_height': 'Icon Height',
    'editor.show_state': 'Show State',
    'editor.show_icon': 'Show Icon',
  };
  return translations[string] || string;
}