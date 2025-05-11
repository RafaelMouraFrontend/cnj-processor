// src/infrastructure/api/cnjService.js
const axios = require('axios');

/**
 * 
 * @param {string} numeroCnj
 * @returns {Promise<Object>} 
 */
async function consultarCnj(numeroCnj) {
  try {
    const apiUrl = process.env.API_EXTERNA_URL || 'http://localhost:3000/cnj';
    
    console.log(`Consultando API externa: ${apiUrl}/${numeroCnj}`);
    
    const response = await axios.get(`${apiUrl}/${numeroCnj}`);
    
    console.log(`Resposta da API externa: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao consultar API externa: ${error.message}`);
    
    if (error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        console.log('CNJ não encontrado na API externa');
        return { status: 'NAO_ENCONTRADO' };
      }
      
      throw new Error(`API externa retornou erro: ${status}`);
    }
    
    throw new Error('Erro de comunicação com API externa');
  }
}

module.exports = {
  consultarCnj
};