<template>
    <div>{{token}}</div>

</template>

<script>
export default {
    data() {
        return {
            token: "",
            id: 0
        }
    }, mounted() {
        this.token = localStorage.getItem('token')
    }
}
</script>
<style></style>