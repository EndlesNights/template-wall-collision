![](https://img.shields.io/badge/Foundry-v0.7.9-informational)
# Template Wall Collision

* **Author**: EndlesNights#9000
* **Version**: 1.0.0
* **Foundry VTT Compatibility**: 0.7.5 to 0.7.9
* **System Compatibility**: Universal
* **Module Dependencies**: libWrapper https://foundryvtt.com/packages/lib-wrapper/

### Link(s) to Module
* [https://github.com/EndlesNights/wall-collision](https://github.com/EndlesNights/wall-collision)

### Description
Template Wall Collision module for Foundry VTT - Adds in collision for Area of Effect Templates with walls while on Square and Hex Maps. Calculation is determined by a ray cast from the templates origin square to the center of all tiles within range. If a wall intersects said ray, it will be considered to not collide with that square and so it will not be highlighted. Wall collision can either be toggled on individually through a templates options window. Or a new toggle button exists in the template panel that when active, will make all newly created templates have collision with walls. An offset value can be manually added in for powers that don't have origins that match the templates origin coordinates.

This module has a required Dependency for libWrapper https://foundryvtt.com/packages/lib-wrapper/

## Installation
### Method 1
* Open the Foundry application and click **"Install Module"** in the **"Add-On Modules"** tab.
* Paste the following link: https://github.com/EndlesNights/template-wall-collision/releases/latest/download/module.json
* Click "Install"
* Activate the module in your World using **Manage Modules** under the **Game Settings** tab.

### Method 2
Extract the query.zip file to the public/modules directory. Use the `Manage Modules` in your World on the Settings tab of the sidebar on the right and then enable the `Template Wall Collision` module.


## Change Log

**Version 1.0.0**

Initial release version.