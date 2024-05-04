import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function queryAnalysis(query){
  console.log('fungsi queryAnalysis()')

  const prompt = `
  Anda akan diberikan query.
  
  Query: ${query}
  
  Tugas anda ialah menganalisis jenis query yang diberikan.
  Apakah query merupakan penjelasan atau penjabaran.
  Jika query mengandung kata 'sebutkan' atau 'apa saja',
  maka query tersebut merupakan penjabaran meskipun terdapat kata 'menjelaskan'.
  
  Berikan respon jawaban dalam format JSON seperti contoh dibawah.
  
  {
    "jenis": "penjelasan"
  }

  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const jawaban = response.text();
  try {
    JSON.parse(jawaban);
    return await JSON.parse(jawaban);
  } catch (error){
    // console.log(error);
    console.log('queryAnalysis() return a non-valid JSON format!');
    return {
      jenis: "penjabaran"
    };
  };
};

export async function penjabaranPrompt(query, sources){
  console.log('fungsi penjabaranPrompt()');
  const promptsPerSource = Promise.all(sources.map(async (s) => {
    const prompt = `
    Anda akan diberikan pertanyaan dan beberapa dokumen hukum.
    
    Pertanyaan: ${query}
    ID Sumber: ${s.id}
    Sumber: ${s.desc}
    Nomor dokumen: ${s.perda}
    
    Anda hanya diizinkan untuk menjawab berdasarkan sumber yang telah diberikan.
    Jawablah pertanyaan yang berhubungan dengan sumber.
    
    ID sumber wajib dicantumkan dan ID sumber tidak boleh diubah sedikitpun.
    Nomor perda tidak boleh diubah sedikitpun.
    Berikan similiarity score menurut anda antara pertanyaan dengan sumber.
    Sebutkan semua nomor pasal yang mendukung jawaban.
    Sebutkan semua isi pasal berdasarkan nomor pasal secara lengkap tanpa merubah sedikitpun isi pasalnya.
    Nomor dan isi pasal wajib dicantumkan.
    
    Berikan respon jawaban dalam format JSON seperti contoh dibawah.
    
    {
      "id": "${s.id}",
      "judul": "${s.name}",
      "perda": "${s.perda}",
      "skor": "similiarity score menurut anda dalam satuan persen (%)",
      "pasal": [
        {
          "nomor": 1,
          "isi": "isi pasal 1"
        },
        {
          "nomor": 2,
          "isi": "isi pasal 2"
        },
      ]
    }
    
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jawaban = response.text();
    try {
      JSON.parse(jawaban);
      return await JSON.parse(jawaban);
    } catch (error){
      // console.log(error);
      console.log(`penjabaranPrompt() ${s.id} return a non-valid JSON format!`);
      return {
        id: s.id,
        judul: s.name,
        perda: s.perda,
        skor: "0%",
        pasal: []
      };
    };
  }));

  return await promptsPerSource;
};

export async function penjabaranPromptStream(query, sources){
  console.log('fungsi penjabaranPrompt()');
  const promptsPerSource = Promise.all(sources.map(async (s) => {
    const prompt = `
    Anda akan diberikan pertanyaan dan beberapa dokumen hukum.
    
    Pertanyaan: ${query}
    ID Sumber: ${s.id}
    Sumber: ${s.desc}
    Nomor dokumen: ${s.perda}
    
    Anda hanya diizinkan untuk menjawab berdasarkan sumber yang telah diberikan.
    Jawablah pertanyaan yang berhubungan dengan sumber.
    
    ID sumber wajib dicantumkan dan ID sumber tidak boleh diubah sedikitpun.
    Judul dan nomor perda tidak boleh diubah sedikitpun.
    Berikan similiarity score menurut anda antara pertanyaan dengan sumber.
    Sebutkan semua nomor pasal yang mendukung jawaban.
    Sebutkan semua isi pasal berdasarkan nomor pasal secara lengkap tanpa merubah sedikitpun isi pasalnya.
    Nomor dan isi pasal wajib dicantumkan.
    
    Berikan respon jawaban dalam format JSON seperti contoh dibawah.

    {
      "id": "${s.id}",
      "judul": "${s.name}",
      "perda": "${s.perda}",
      "skor": "similiarity score menurut anda dalam satuan persen (%)",
      "pasal": [
        {
          "nomor": 1,
          "isi": "isi pasal 1"
        },
        {
          "nomor": 2,
          "isi": "isi pasal 2"
        },
      ]
    }
    
    `;
    const result = await model.generateContentStream(prompt);
    let jawaban = '';
    for await (const chunk of result.stream){
      const chunkText = chunk.text();
      jawaban += chunkText;
    };
    // console.log(jawaban);
    return jawaban;
  }));

  return await promptsPerSource;
};

export async function penjelasanPrompt(query, sources){
  console.log('fungsi penjelasanPrompt()');
  const promptsPerSource = Promise.all(sources.map(async (s) => {
    const prompt = `
    Anda akan diberikan pertanyaan dan beberapa dokumen hukum.
    
    Pertanyaan: ${query}
    ID Sumber: ${s.id}
    Sumber: ${s.desc}
    
    Anda hanya diizinkan untuk menjawab berdasarkan sumber yang telah diberikan.
    Jawablah pertanyaan yang berhubungan dengan sumber.
    
    ID sumber wajib dicantumkan dan ID sumber tidak boleh diubah sedikitpun.
    Nomor perda tidak boleh diubah sedikitpun.
    Berikan similiarity score menurut anda antara pertanyaan dengan sumber.
    Berikan rangkuman jawaban secara lengkap berdasarkan sumber.
    Berikan semua nomor pasal yang mendukung jawaban.
    Nomor pasal wajib dicantumkan.

    Berikan respon jawaban dalam format JSON seperti contoh dibawah.

    {
      "id": "${s.id}",
      "judul": "${s.name}",
      "perda": "${s.perda}",
      "skor": "similiarity score menurut anda dalam satuan persen (%)",
      "jawaban": "rangkum jawaban secara lengkap",
      "pasal": [
        {
          "nomor": 1,
        },
        {
          "nomor": 2,
        },
      ]
    }

    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jawaban = response.text();
    try {
      JSON.parse(jawaban);
      return await JSON.parse(jawaban);
    } catch (error){
      // console.log(error);
      console.log(`penjelasanPrompt() ${s.id} return a non-valid JSON format!`);
      return {
        id: s.id,
        judul: s.name,
        perda: s.perda,
        skor: "0%",
        jawaban: "-",
        pasal: []
      };
    };
  }));

  return await promptsPerSource;
};