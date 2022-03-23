<template>
    <div>
        <MapComponent/>
        <NavComponent/>
    </div>
</template>

<script>
import MapComponent from './MapComponent.vue'
import NavComponent from './NavComponent.vue'
export default {
    data(){
        return {

        }
    },
    components: {MapComponent, NavComponent}
}
</script>

<style scoped>

</style>