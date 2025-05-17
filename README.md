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

---

### 📖 4. **Update `README.md`**

^[Enhance your `README.md` to include installation instructions, usage examples, and any other relevant information. This helps users understand how to use your card effectively.]({"attribution":{"attributableIndex":"1639-1"}})

---

### 🧪 5. **Testing**

^[Before publishing, test your card thoroughly:]({"attribution":{"attributableIndex":"1858-1"}})

- ^[Install it via HACS in your Home Assistant setup.]({"attribution":{"attributableIndex":"1935-0"}})
- ^[Add the card to your Lovelace dashboard using the provided configuration.]({"attribution":{"attributableIndex":"1935-1"}})
- ^[Ensure that both sensor values display correctly and that the card behaves as expected.]({"attribution":{"attributableIndex":"1935-2"}}) [oai_citation:0‡GitHub](https://github.com/royto/logbook-card?utm_source=chatgpt.com)

---

### 🚀 6. **Publishing**

^[Once everything is set:]({"attribution":{"attributableIndex":"2161-1"}})

- ^[Commit and push your changes to the GitHub repository.]({"attribution":{"attributableIndex":"2219-0"}})
- ^[Create a new release with a version tag (e.g., `v1.0.0`).]({"attribution":{"attributableIndex":"2219-1"}})
- ^[Ensure that the `dual-sensor-card.js` file is included in the release assets.]({"attribution":{"attributableIndex":"2219-2"}})

^[After publishing, users can add your repository as a custom repository in HACS and install the card directly from there.]({"attribution":{"attributableIndex":"2424-0"}})

---

If you need assistance with any of these steps or further customization, feel free to ask! 