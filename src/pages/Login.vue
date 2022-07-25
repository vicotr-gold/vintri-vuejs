<template>
    <section class="section-container">
        <v-row class="signin">
            <v-col cols="8" class="left">
                <h1>Welcome to my site</h1>
            </v-col>
            <v-col cols="4" class="right">
                <h2>LOGIN</h2>
                <v-form v-model="valid" @submit.prevent="submit">
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field v-model="password" :rules="passwordRules" label="Password"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPass = !showPass"
                        required outlined dense dark filled :type="showPass ? 'text' : 'password'"></v-text-field>
                    <div class="text-center">
                        <v-btn class="signin-btn" type="submit" rounded color="white" dark> Sign In </v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </section>
</template>

<script>
export default {
    name: "LoinPage",
    components: {},
    data: () => ({
        showPass: false,
        valid: false,
        password: "",
        passwordRules: [(v) => !!v || "Password is required", (v) => v.length <= 10 || "Password must be less than 10 characters"],
        email: "",
        emailRules: [(v) => !!v || "E-mail is required", (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
    }),
    computed: {
        params() {
            return {
                email: this.email,
                password: this.password,
            };
        },
    },
    methods: {
        async submit() {
            if (this.valid) {
                setTimeout(() => {
                    this.$store.dispatch('auth/login', { user: this.params })
                }, 1500)
            }
        },
        clear() {
            // you can use this method to clear login form
            this.email = "";
            this.password = null;
            this.$refs.observer.reset();
        },
    },
};
</script>
