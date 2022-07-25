<template>
    <v-parallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">Vuetify</h1>
            <h4 class="subheading mb-4">Build your beers rating today!</h4>
            <v-btn v-if="user" rounded color="primary" dark @click="redirectLogin()"> Search Beers </v-btn>
            <v-btn v-else rounded color="primary" dark @click="redirectLogin()"> Login </v-btn>
        </div>
    </v-parallax>
</template>
<script>
export default {
    name: "HomePage",
    data() {
        return {
            user: this.$store.state.auth.user
        };
    },
    methods: {
        async redirectLogin() {
            if (this.user) {
                this.$router.push({ name: "dashboard" });

            } else {
                this.$router.push({ name: "login" });

            }
        },
    },
};
</script>
