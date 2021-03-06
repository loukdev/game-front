<template>
    <div class="full-storage-display">
        <resource-item :resource="resource" />
        <div class="info">
            <div class="storage">
                <div class="status">
                    <span :class="{full: isFull}">{{ quantity }}</span> / {{ capacity }}
                </div>
                <div class="storage-line">
                    <div :class="['storage-display', resource.name]">
                        <div class="storage-full" :style="{ width: `${ filledCapacity }%`, backgroundColor: color }"></div>
                        <div class="storage-empty"></div>
                    </div>
                    <div :class="{full: isFull}">
                        {{ fullCapacityAt }}
                    </div>
                </div>
                <div class="hourly-production">
                    +{{ hourlyProduction() }}/h
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ResourceItem from '~/components/atoms/resource/item';

export default {
    name: 'resource-storage-item',

    props: ['resource', 'storage'],

    components: {
        ResourceItem
    },

    methods: {
        hourlyProduction() {
            return this.resource.density * 10;
        }
    },

    computed: {
        isFull() {
            return this.quantity > 0 && this.quantity === this.capacity;
        },

        quantity() {
            return (this.storage.resources[this.resource.name]) ? this.storage.resources[this.resource.name] : 0;
        },

        capacity() {
            return (this.storage.capacity) ? this.storage.capacity : 5000;
        },

        color() {
            return this.$resources.resources[this.resource.name].color;
        },

        filledCapacity() {
            return (this.quantity > 0) ? (this.quantity / this.capacity) * 100 : 0;
        },

        fullCapacityAt() {
            return (this.capacity !== this.quantity)
                ? "-" + Math.floor((this.capacity - this.quantity) / this.hourlyProduction()) +
                  "h" + (60 - (new Date()).getMinutes()) + "min"
                : this.$i18n.t('planet.storage.full')
            ;
        }
    }
}
</script>

<style lang="less" scoped>
    .storage {
        text-align: center;
    }

    .storage-display {

        border: 5px solid #EFEFEF;
        border-radius: 25px;
        height:25px;
        width :100%;
    }

    .storage-full {
        border-radius: 25px;
        background-color: grey;
        height : 100%;
    }

    .status {
        & > span {
            font-size: 1.7em;
        }
    }

    .full {
        color: rgb(255, 0, 102);
    }

    .info {
        flex: 1;
        margin-left: 10px;
    }

    .full-storage-display {
        display: flex;
        align-items:center;
    }

    .full-storage-display > h5 {
        margin :0;
    }

    .info {
        justify-content: center;
    }

    .hourly-production {
        justify-content: flex-end;
    }
</style>
