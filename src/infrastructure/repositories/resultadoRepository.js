const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function salvar(resultado) {
  const params = {
    TableName: process.env.TABELA_RESULTADOS,
    Item: {
      cnj: resultado.cnj,
      dadosExternos: resultado.dadosExternos,
      dataProcessamento: resultado.dataProcessamento
    }
  };
  
  try {
    await dynamodb.put(params).promise();
    return resultado;
  } catch (error) {
    console.error(`Erro ao salvar no DynamoDB: ${error.message}`);
    throw new Error('Falha ao armazenar resultado');
  }
}

async function buscarPorCnj(numeroCnj) {
  const params = {
    TableName: process.env.TABELA_RESULTADOS,
    Key: {
      cnj: numeroCnj
    }
  };
  
  try {
    const result = await dynamodb.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(`Erro ao buscar no DynamoDB: ${error.message}`);
    throw new Error('Falha ao buscar resultado');
  }
}

module.exports = {
  salvar,
  buscarPorCnj
};