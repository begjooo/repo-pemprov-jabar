<template>
  <div id="outer_container">
    <div id="main_container">
      <HeaderContainer />
      <div id="chat_container">
        <UserInputChat />
      </div>
      <div id="rekomendasi_container">
        <DaftarRekomendasi />
      </div>
    </div>
  </div>
</template>

<script setup>

import HeaderContainer from './components/HeaderContainer.vue'
import UserInputChat from './components/UserInputChat.vue';
import DaftarRekomendasi from './components/DaftarRekomendasi.vue'

</script>

<style scoped>

#outer_container{
  width: 100vw;
  display: flex;
  justify-content: center;
}

#main_container{
  width: 100vw;
  max-width: 1000px;
}

#chat_container {
  margin-top: 50px;
}

</style>