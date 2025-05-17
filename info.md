# Dual Sensor Card

A custom Lovelace card for Home Assistant to display two sensor values side by side.

## Configuration

```yaml
type: 'custom:dual-sensor-card'
title: 'Room Conditions'
entity_1: sensor.temperature
entity_2: sensor.humidity