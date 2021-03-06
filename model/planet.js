import System from './system.js';

export default class Planet {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.player = data.player;
        this.system = (data.system !== null) ? new System(data.system) : null;
        this.population = data.population;
        this.buildings = data.buildings;
        this.nb_buildings = data.nb_buildings;
        this.orbit = data.orbit;
        this.available_buildings = data.available_buildings;
        this.settings = data.settings;
        this.relations = data.relations;
        this.resources = data.resources;
        this.storage = (data.storage !== null) ? data.storage : { resources: [] };
        this.ships = new Array();
        this.shipGroups = new Array();
    }

    updateShipGroups(shipGroup, nbShips) {
        let index = -1;
        for (const sg of this.shipGroups) {
            if (sg.id === shipGroup.id) {
                index = this.shipGroups.indexOf(sg);
                sg.quantity += nbShips;
                break;
            }
        }
        if (index === -1 && nbShips > 0) {
            this.shipGroups.push(Object.assign({}, shipGroup, { quantity: nbShips }));
        } else if (index >= 0 && this.shipGroups[index].quantity === 0) {
            this.shipGroups.splice(index, 1);
        }
    }

    canConstruct() {
        return this.planet.nb_buildings > this.planet.buildings.length;
    }

    toJSON() {
        return Object.assign({}, this);
    }
};