<template>
    <div id="trade-post">
        <offers-list :offers="offers" :selectedOffer="selectedOffer" @selectOffer="selectedOffer = $event" @unselectOffer="selectedOffer = null" />
        <div id="offer-search">
            <h1 :style="{ color: factionColors['main'] }">
                <colored-picto src="B_Merc_64px.png" :width="32" :height="32" color="white" />
                <span>{{ $t('trade.trading_post') }}</span>
            </h1>
        </div>
        <offer-details v-if="selectedOffer" :offer="selectedOffer" :key="selectedOffer.id" @acceptOffer="acceptOffer" @cancelOffer="cancelOffer" />
        <offer-creation v-else-if="!isStorageEmpty" @addOffer="addOffer" />
    </div>
</template>

<script>
import ColoredPicto from '~/components/atoms/colored-picto';
import OffersList from '~/components/organisms/trade/offers-list';
import OfferDetails from '~/components/organisms/trade/offer-details';
import OfferCreation from '~/components/organisms/trade/offer-creation';
import { OPERATION_SELL } from '~/model/trade/offer';
import { mapGetters } from 'vuex';

export default {
    name: 'page-trade-building',

    components: {
        ColoredPicto,
        OffersList,
        OfferDetails,
        OfferCreation
    },

    data() {
        return {
            selectedOffer: null
        }
    },

    async asyncData({ app }) {
        return {
            offers: await app.$repositories.trade.offer.getAll(OPERATION_SELL)
        };
    },

    computed: {
        ...mapGetters({
            isStorageEmpty: 'user/isStorageEmpty',
            factionColors: 'user/factionColors',
            currentPlanet: 'user/currentPlanet'
        })
    },

    methods: {
        addOffer(offer) {
            this.offers.push(offer);
        },

        async acceptOffer(nbLots) {
            await this.$repositories.trade.offer.accept(this.selectedOffer, nbLots, this.currentPlanet.id);

            const quantity =  nbLots * this.selectedOffer.lotQuantity;
            this.selectedOffer.quantity -= quantity;

            this.$store.commit('user/updateStorageResource', {
                resource: this.selectedOffer.resource,
                quantity: quantity
            });
            this.$store.commit('user/spend', {
                type: 'credits',
                amount: this.selectedOffer.price * quantity
            });

            if (this.selectedOffer.quantity === 0) {
                this.removeOffer(this.selectedOffer);
            }
            this.selectedOffer = null;
        },

        async cancelOffer() {
            await this.$repositories.trade.offer.cancel(this.selectedOffer);

            this.removeOffer(this.selectedOffer);

            this.$store.commit('user/updateStorageResource', {
                resource: this.selectedOffer.resource,
                quantity: this.selectedOffer.quantity
            });

            this.selectedOffer = null;
        },

        removeOffer(offer) {
            for (const i in this.offers) {
                if (this.offers[i].id === offer.id) {
                    this.offers.splice(i, 1);
                }
            }
        }
    }
}
</script>


<style lang="less" scoped>
    #offers-list {
        grid-column: ~"2/5";
        grid-row: ~"3/9";
    }

    #offer-search {
        grid-column: ~"5/7";
        grid-row: ~"3/9";

        & > h1 {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            margin: 0px;

            font-size: 1.0em;
            font-variant: small-caps;

            & > span {
                margin-left: 10px;
            }
        }
    }

    #offer-creation,
    #offer-details {
        grid-column: ~"7/10";
        grid-row: ~"3/9";
    }
</style>