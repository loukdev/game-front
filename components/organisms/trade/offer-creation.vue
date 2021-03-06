<template>
    <div id="offer-creation" :style="{ borderColor: factionColors['main'] }">
        <section>
            <div class="resources">
                <h5>Ressource</h5>
                <div id="resource-slider">
                    <div
                        v-for="(amount, resource) in storedResources"
                        :key="resource"
                        @click="selectedResource = resource"
                        :class="{ selected: resource === selectedResource }"
                        :style="{ borderColor: resourceColor }">
                        <resource-item :resource="{ name: resource }" width="26px" height="26px" />
                    </div>
                </div>
            </div>
            <div class="quantity">
                <h5>Quantité</h5>
                <gauge-selector
                    :min="100"
                    :initialValue="100"
                    :color="resourceColor"
                    :max="currentResourceAvailable"
                    @change="quantity = $event"
                    @stop="checkQuantity" />
            </div>
            <div class="lot-quantity">
                <h5>Quantité par lot</h5>
                <gauge-selector
                    :min="1"
                    :initialValue="quantity"
                    :color="resourceColor"
                    :max="quantity"
                    @change="lotQuantity = $event"
                    @stop="checkLotQuantity" />
            </div>
            <div class="price">
                <h5>Prix</h5>
                <input type="number" v-model="price" :style="{ color: resourceColor, borderColor: resourceColor }" />
            </div>
            <div class="recap">
                <p>Quantité totale : <strong>{{ quantity }}</strong></p>
                <p>Contenu d'un lot : <strong>{{ lotQuantity }}</strong></p>
                <p>Nombre de lots : <strong>{{ nbLots }}</strong></p>
                <p>Prix d'un lot : <strong>{{ price * lotQuantity }}</strong></p>
                <p>Prix total : <strong>{{ price * quantity }}</strong></p>
            </div>
        </section>
        <footer>
            <button class="button big" @click="create" :style="{ color: factionColors['main'] }">Créer une offre</button>
        </footer>
    </div>
</template>

<script>
import { OPERATION_SELL, GOOD_TYPE_RESOURCES } from '~/model/trade/offer';
import ResourceOffer from '~/model/trade/resource_offer';
import GaugeSelector from '~/components/atoms/gauge-selector';
import ResourceItem from '~/components/atoms/resource/item';
import { mapGetters } from 'vuex';

export default {
    name: 'offer-creation',

    components: {
        GaugeSelector,
        ResourceItem
    },

    data() {
        return {
            operation: OPERATION_SELL,
            goodType: GOOD_TYPE_RESOURCES,
            selectedResource: Object.keys(this.$store.state.user.currentPlanet.storage.resources)[0],
            quantity: 100,
            lotQuantity: 100,
            price: 1
        };
    },

    computed: {
        ...mapGetters({
            factionColors: 'user/factionColors',
            storedResources: 'user/storedResources'
        }),

        resourceColor() {
            return this.$resources.resources[this.selectedResource].color;
        },

        currentResourceAvailable() {
            return this.$store.getters['user/getStoredResource'](this.selectedResource);
        },

        nbLots() {
            return Math.floor(this.quantity / this.lotQuantity);
        }
    },
    
    methods: {
        checkLotQuantity() {
            this.lotQuantity = Math.floor(this.quantity / this.nbLots);

            this.checkQuantity();
        },

        checkQuantity() {
            while (this.quantity % this.lotQuantity > 0) {
                this.quantity--;
            }
        },

        async create() {
            const offer = await this.$repositories.trade.offer.create(
                this.operation,
                this.goodType,
                this.$store.state.user.currentPlanet,
                parseInt(this.quantity),
                parseInt(this.lotQuantity),
                parseFloat(this.price),
                this.selectedResource
            );
            this.$store.commit('user/updateStorageResource', {
                resource: this.selectedResource,
                quantity: -this.quantity
            });
            this.$emit('addOffer', new ResourceOffer(
                offer.id,
                offer.operation,
                offer.location,
                offer.created_at,
                offer.accepted_at,
                offer.quantity,
                offer.lot_quantity,
                offer.price,
                offer.resource
            ));
        }
    }
}
</script>

<style lang="less" scoped>
    @import '~less/atoms/button.less';

    #offer-creation {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        border: 1px solid;
        border-radius: 10px;

        & > section {
            flex-grow: 1;

            & > .resources {
                & > h5 {
                    margin: 0px;
                }
            }

            & > .quantity,
            & > .lot-quantity,
            & > .price {
                display: flex;
                align-items: flex-end;
                margin: 5px 0px;

                & > h5 {
                    margin: 0px;
                    flex-basis: 120px;
                }

                & > .gauge-selector {
                    flex-grow: 1;
                }

                & > input {
                    flex-grow: 1;
                    border: 1px solid;
                    border-radius: 10px;
                    padding: 5px 10px;
                    background-color: #242424;
                    font-weight: bold;
                }
            }

            & > .price {
                margin-top: 10px;
            }

            & > .recap {
                margin-top: 20px;
                border: 1px solid white;
                border-radius: 10px;
                padding: 0px 10px;
            }
        }

        & > footer {
            padding: 10px;
            display: flex;
            justify-content: center;
        }
    }

    #resource-slider {
        display: flex;

        flex-wrap: wrap;

        & > div {
            padding: 5px;
            margin: 5px;
            border-radius: 5px;
            border: 1px solid white;
            cursor: pointer;

            &:not(.selected) {
                border-color: white !important;
            }
        }

    }
</style>
