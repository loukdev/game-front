<template>
    <div class="info">
        <faction-banner :faction="faction" width="80" height="130"/>
        <h1 :style="{ color: faction.colors['main'] }">{{ faction.name }}</h1>
    </div>
</template>

<script>
import FactionBanner from '~/components/atoms/faction/banner';

export default {
    name: 'faction-data',

    props: ['faction'],

    components: {
        FactionBanner
    }
}
</script>

<style lang="less" scoped>
    .info {
        display: flex;
    }

    h1 {
        margin: 0px;
        padding-left: 20px;
    }
</style>
