import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function queryAnalisys(query){
  const prompt = `
  Anda akan diberikan pertanyaan

  Pertanyaan:
  '''${query}'''

  Tugas anda ialah menganalisis jenis pertanyaan yang diberikan.
  Berdasarkan pertanyaan tersebut, apakah pertanyaan tersebut merupakan pertanyaan yang meminta penjelasan atau hanya meminta penjabaran.
  Jika pertanyaan mengandung kata 'sebutkan' atau 'apa saja', maka jenis pertanyaan merupakan penjabaran meskipun terdapat kata 'menjelaskan'.

  Jawablah dalam format JSON seperti contoh berikut
  {"jenis": "penjabaran"}
  `

  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return response.text();
}

export async function penjelasanPrompt(query, sources){
  // console.log(sources)

  const prompt = `
  Anda akan diberikan pertanyaan dan beberapa dokumen hukum.
  
  Pertanyaan: ${query}
  Sumber: ${sources}
  
  Anda hanya diizinkan untuk menjawab berdasarkan sumber yang telah diberikan.
  Jawablah pertanyaan yang berhubungan dengan sumber.
  
  Berikan similiarity score antara setiap dokumen dengan pertanyaan.
  Berikan jawaban berupa rangkuman berdasarkan setiap dokumen.
  Berikan semua pasal yang mendukung jawaban.
  Nomor pasal wajib dicantumkan, jika tidak maka tidak perlu menjawab.
  
  Cantumkan semua dokumen yang diberikan meskipun tidak berhubungan dengan pertanyaan.
  Urutkan respon jawaban berdasarkan similiarity score dari tertinggi hingga terendah.

  Berikan respon jawaban dengan format yang sama persis dengan format berikut:
  '''
  - Judul dokumen: Judul dokumen
  - Skor: 100.00%
  - Jawaban: Hasil rangkuman singkat
  - Pasal: Pasal 1, Pasal 2, ...
  '''

  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  // console.log('Jawaban:\n', response.text());
  return response.text();
};

export async function penjabaranPrompt(query, sources){
  // console.log(sources)

  const prompt = `
  Anda akan diberikan pertanyaan dan beberapa dokumen hukum.
  
  Pertanyaan: ${query}
  Sumber: ${sources}
  
  Anda hanya diizinkan untuk menjawab berdasarkan sumber yang telah diberikan.
  Jawablah pertanyaan yang berhubungan dengan sumber.
    
  Cantumkan semua dokumen yang diberikan meskipun tidak berhubungan dengan pertanyaan.
  Urutkan respon jawaban berdasarkan similiarity score dari tertinggi hingga terendah.
  
  Berikan respon jawaban berupa pasal yang sama persis dengan format berikut:
  '''
  - Judul dokumen: Judul dokumen
  - Skor: 100.00%
  - Pasal: Daftar pasal
    - Pasal 1: 
      Isi pasal 1 harus sama persis
    - Pasal 2: 
      Isi pasal 2 harus sama persis

  '''

  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  // console.log('Jawaban:\n', response.text());
  return response.text();
};