# Dual Sensor Card

A Home Assistant custom card that displays a **switch and a kWh sensor** in a tile-style format.

## Features
✅ Toggle switch  
✅ Displays kWh value  
✅ Works with Home Assistant themes  
✅ Compatible with HACS  

## Installation
### Manual
1. Download `dual-sensor-card.js` from the [latest release](https://github.com/yourusername/dual-sensor-card/releases).
2. Place it in your Home Assistant `www/custom-lovelace/` folder.
3. Add it as a resource:
   ```yaml
   lovelace:
     resources:
       - url: /local/custom-lovelace/dual-sensor-card.js
         type: module