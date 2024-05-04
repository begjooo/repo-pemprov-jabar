<template>
  <div class="chat-app">
    <form @submit.prevent="sendMessage" class="form-container">
      <button type="submit">Tanyakan Kebutuhan <br> Penugasan Disini</button>
      <input type="text" v-model="message" placeholder="Type your message here...">
      <!-- <div v-if="submittedMessage" class="submitted-message">{{ submittedMessage }}</div> -->
    </form>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
  <div v-for="(result, index) in jawaban" :key="index">
    <br>ID Doc = {{ result.id }}
    <br>Dokumen = {{ result.judul }}
    <br>Nomor Perda = {{ result.perda }}
    <br>Skor = {{ result.skor }}
    <br>Pasal:
    <div v-for="(pasal) in result.pasal">
      - Nomor {{ pasal.nomor }}: {{ pasal.isi }}
    </div>
    <br>{{ result.jawaban }}
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('');
const error = ref('');
const submittedMessage = ref('');
const jawaban = ref([]);

const sendMessage = async () => {
  if (message.value.trim() !== '') {
    submittedMessage.value = message.value;
    message.value = '';
    error.value = '';
    console.log(submittedMessage.value);
    
    const query = await fetch('http://localhost:3000/askQuestion/' + submittedMessage.value)
    jawaban.value = await query.json();
    console.log(jawaban.value);
  } else {
    error.value = 'Input tidak boleh kosong';
  }
};
</script>

<style scoped>
.chat-app {
  width: 100%;
  margin: 0 auto;
  position: relative; /* Tambahkan posisi relatif untuk mengatur posisi pesan error */
}

.form-container {
  display: flex;
  align-items: center;
  position: relative; /* Tambahkan posisi relatif untuk mengatur posisi pesan terkirim */
}

input[type="text"], button {
  height: 50px;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

input[type="text"] {
  flex: 1;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0 20px;
  border-radius: 5px;
  cursor: pointer;
  width: auto;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  position: absolute; /* Tambahkan posisi absolut */
  bottom: -20px; /* Sesuaikan dengan kebutuhan */
  left: 0;
  width: 100%;
  text-align: center;
}

.submitted-message {
  position: absolute;
  bottom: -30px; /* Atur posisi agar di bawah input */
  left: 0;
  width: 100%;
  text-align: center;
  color: #007bff; /* Ganti warna sesuai keinginan */
}
</style>
