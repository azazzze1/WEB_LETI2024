<template>
  <div class="navigator">
    <router-link to="/exchange" class="router">Exchange</router-link> 
    <router-link to="/admin" class="router">Admin</router-link> 
    <router-link to="/login" class="router">Login</router-link>
  </div>
  <AppHeader />
  <router-view/>
</template>

<script>
import AppHeader from './components/Header.vue'
export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .navigator{
    display: flex;
    align-items: center;
    justify-content: center;
    position:absolute;
    left: 650px;
    margin-top: 50px;
    color: white;
    gap: 30px;
  }

  .router{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 10px 10px 10px;
    margin-right: 21px;
    color: white;
    border-radius: 292px;
    background: #06F;
  }
</style>
