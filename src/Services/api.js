import axios from 'axios';

// Criamos uma instância do axios apontando para o JSON Server
// export const api = axios.create({
//   baseURL: 'http://localhost:3000' 
// });

// import axios from 'axios';

// export const api = axios.create({
//   baseURL: 'http://localhost:3000' // Certifique-se de que NÃO tem a palavra /clientes aqui!
// });


// export const api = axios.create({
//   // URL base padrão do JSONBin para acessar um "Bin" específico
//   baseURL: 'https://api.jsonbin.io/v3/b/69a8839143b1c97be9b396bc',
//   headers: {
//     // Substitua pelo seu X-Master-Key real
//     'X-Master-Key': '$2b$10$apRIu09wR5tmKKJDSBbv/umKs23JlM4Rqy17snJlgdOa0UEMEsI3S',
//     'Content-Type': 'application/json'
//   }
// });



export const api = axios.create({
  baseURL: 'https://api.jsonbin.io/v3/b/69a8839143b1c97be9b396bc',
  headers: {
    'X-Master-Key': '$2b$10$apRIu09wR5tmKKJDSBbv/umKs23JlM4Rqy17snJlgdOa0UEMEsI3S', 
    'X-Bin-Meta': 'false', // Isso faz os dados virem puros, sem precisar do .record
    'Content-Type': 'application/json'
  }
});

