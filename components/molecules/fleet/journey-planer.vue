<template>
    <div id="journey-planer">
        <header>
            <h3>{{ $t('fleet.title', { fleet: fleet.id }) }}</h3>
            <button class="button" :style="{ color: factionColors['main'] }" @click="sendFleet">{{ $t('journey.planer.send_fleet') }}</button>
        </header>
        <section>
            <div v-if="fleet.journey.steps.length === 0">
                <p>{{ $t('journey.planer.empty_steps') }}</p>
            </div>
            <journey-step-recap v-for="step in fleet.journey.steps" :key="step.number" :step="step" @selectStepOrder="selectedStep = step" />
        </section>
        <footer>
            <div>
                <strong>{{ $t('journey.planer.estimated_time') }}</strong>
                <span class="time">{{ $t('journey.planer.no_time') }}</span>
            </div>
            <button class="button" :style="{ color: factionColors['white'] }" @click="removeLastStep">{{ $t('journey.planer.remove_last_step') }}</button>
        </footer>
        <journey-step-order-panel v-if="selectedStep" :step="selectedStep" @unselectStep="selectedStep = null"/>
    </div>
</template>

<script>
import JourneyStepRecap from '~/components/molecules/fleet/journey-step-recap';
import JourneyStepOrderPanel from '~/components/molecules/fleet/journey-step-order-panel';
import JourneyStep, { ORDER_PASS } from '~/model/fleet/journeyStep';
import { mapGetters } from 'vuex';

const OFFSET_SIZE_TARGET = -17; // -7 :  (widthExtene - widthIntern)/2 + boder width

export default {
    name: 'fleet-journey-planer',

    components: {
        JourneyStepRecap,
        JourneyStepOrderPanel,
    },

    data () {
        return {
            selectedStep: null
        };
    },

    async mounted() {
        //const range = await this.$repositories.fleet.getFleetRange(this.$store.state.map.fleet);
        const range = this.$resources.journey_range;
        this.$store.commit('map/fleetRange', range);

        if (this.$store.state.map.fleet.isOnJourney()) {
            return false;
        }
        document.querySelector('body').addEventListener('click', this.addPointMap);
    },

    computed: {
        ...mapGetters({
            factionColors: 'user/factionColors',
            fleet: 'map/fleet'
        })
    },

    methods: {
        async sendFleet(event) {
            if (this.$store.state.map.fleet.journey.steps.length === 0) {
                return false;
            }
            let steps;
            try {
                steps = await this.$repositories.fleet.sendOnJourney(this.$store.state.map.fleet);
            } catch(err) {
                this.$store.dispatch('user/addActionNotification', {
                    isError: true,
                    content: err
                });
                return;
            }
            this.$store.commit('map/fleetJourneySteps', steps);
            this.$store.commit('map/selectedPlanets', []);

            this.$store.dispatch('user/addActionNotification', {
                isError: false,
                content: `journey.sending_success`
            });

            this.$router.push('/map');
        },

        async addPointMap(event) {
            if (event.type === 'click') {
                event.preventDefault();
            }
            if (!event.target.classList.contains('range')) {
                return false;
            }

            const map = document.querySelector("#starmap");
            const scale = this.$store.state.map.scale;

            const x = (-parseInt(map.style.left) + event.clientX) / scale;
            const y = (-parseInt(map.style.top) + event.clientY) / scale;
            
            const stepData = {
                id: this.$store.state.map.fleet.journey.steps.length,
                map_pos_x_start: this.$store.getters['map/previousX'],
                map_pos_y_start: this.$store.getters['map/previousY'],
                planet_final: null,
                map_pos_x_final: x,
                map_pos_y_final: y,
                order: ORDER_PASS
            };
            
            const distance = Math.sqrt(Math.pow(x - stepData.map_pos_x_start, 2) + Math.pow(y - stepData.map_pos_y_start, 2));
            
            if (distance > this.$store.getters['map/range'](x, y, null)) {
                // TODO
                throw 'out of range';
            }
            this.$store.commit('map/addStep', new JourneyStep(stepData));
        },

        removeLastStep() {
            this.$store.commit('map/removeLastStep');
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~less/atoms/button.less';

    #journey-planer {
        background-color: rgba(0,0,0,0.6);
        padding: 10px 20px;

        & > header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        & > section {
            border-bottom: 1px solid grey;

        }

        & > footer {
            & > div {
                margin-top: 5px;
                margin-bottom: 10px;
            }
        }
    }
</style>
