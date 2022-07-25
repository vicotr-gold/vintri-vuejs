<template>
  <div class="not-found">
    <b-col cols="12" class="my-4">
      <h1 class="title">404</h1>
      <p class="my-5">Sorry, we could not find that page</p>
      <router-link to="/">To Home</router-link>
    </b-col>
  </div>

</template>

<script>
export default {
  name: 'NotFound',
}
</script>
