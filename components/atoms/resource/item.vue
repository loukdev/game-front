<template>
    <img :src="resourcePicto" :alt="resourceName" />
</template>

<script>
export default {
    name: 'resource-item',

    props: ['resource'],
    
    data: function() {
        return {
            planetResource: Object.assign({}, this.resource, this.$resources.resources[this.resource.name])
        }
    },
    
    computed: {
        resourcePicto: function() {
            return `/images/resources/${this.planetResource.picto}`;
        },
        resourceName: function() {
            return this.$i18n.t('planet.resources')[this.planetResource.name];
        }
    }
}
</script>

<style lang="less" scoped>

</style>
