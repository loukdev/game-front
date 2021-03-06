import FleetRange from '~/model/fleet/range';

export const state = () => ({
    targetedSystemId: null,
    selectedPlanets: [],
    fleet: null,
    scale: 80,
    size: 0
});

export const getters = {
    lastStep(state) {
        if (state.fleet === null || state.fleet.journey === null || state.fleet.journey.steps.length === 0) {
            return null;
        }
        return state.fleet.journey.steps[state.fleet.journey.steps.length - 1];
    },

    previousX(state, getters) {
        if (state.fleet === null) {
            return null;
        }
        const lastStep = getters.lastStep;

        return (lastStep !== null)
            ? lastStep.endX
            : (state.fleet.location !== null)
                ? state.fleet.location.system.x
                : state.fleet.map_pos_x;
    },
    
    previousY(state, getters) {
        if (state.fleet === null) {
            return null;
        }
        const lastStep = getters.lastStep;

        return (lastStep !== null)
            ? lastStep.endY
            : (state.fleet.location !== null)
                ? state.fleet.location.system.y
                : state.fleet.map_pos_y;
    },
    
    previousPlanet(state, getters) {
        if (state.fleet === null) {
            return null;
        }
        const lastStep = getters.lastStep;
        
        return (lastStep !== null)
            ? lastStep.endLocation
            : (state.fleet.location !== null)
                ? state.fleet.location
                : null;
    },

    range(state, getters) {
        return (x, y, planetId) => {
            const rangeData = state.fleet.range;
            if (getters.previousPlanet !== null) {
                if (planetId !== null) {
                    return (getters.previousX === x && getters.previousY === y)
                        ? rangeData.same_system
                        : rangeData.planet_to_planet;
                }
                return rangeData.planet_to_position;
            }
            return (planetId != 0)
                ? rangeData.position_to_planet
                : rangeData.position_to_position;
        };
    },

    selectedPlanets: state => state.selectedPlanets,
    
    fleet: state => state.fleet,
};

export const mutations ={
    setScale(state, scale) {
        state.scale = scale;
    },

    setSize(state, size) {
        state.size = size;
    },

    setTargetedSystemId(state, id) {
        state.targetedSystemId = id;
    },

    setFleet(state, fleet) {
        state.fleet = fleet;
    },

    addStep(state, step) {
        state.fleet.journey.steps.push(step);
        if (step.endLocation !== null) {
            state.selectedPlanets.push(step.endLocation.id);
        }
    },

    selectedPlanets: (state, planets) => { state.planets = planets; }, 

    stepOrder (state, payload) {
        state.fleet.journey.steps[state.fleet.journey.steps.indexOf(payload.step)].order = payload.order;
    },

    removeLastStep(state) {
        if (state.fleet === null || state.fleet.journey === null || state.fleet.journey.steps.length === 0) {
            return;
        }
        state.fleet.journey.steps.pop();
    },

    fleetRange(state, range) {
        state.fleet.range = new FleetRange(range);
    },

    fleetJourneySteps(state, steps) {
        state.fleet.journey.steps = steps;
    }
};