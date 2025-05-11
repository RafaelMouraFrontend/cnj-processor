const { CNJ } = require('../domain/cnj');
const cnjService = require('../infrastructure/api/cnjService');
const resultadoRepository = require('../infrastructure/repositories/resultadoRepository');

async function processarCnj(numeroCnj) {
  try {
    const cnj = new CNJ(numeroCnj);
    
    const dadosExternos = await cnjService.consultarCnj(cnj.toString());
    
    const resultado = {
      cnj: cnj.toString(),
      dadosExternos,
      dataProcessamento: new Date().toISOString()
    };
    
    await resultadoRepository.salvar(resultado);
    
    return resultado;
  } catch (error) {
    console.error(`Erro ao processar CNJ: ${error.message}`);
    throw error;
  }
}

module.exports = {
  processarCnj
};