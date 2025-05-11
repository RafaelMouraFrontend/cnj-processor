const { processarCnj } = require('../../application/processarCnj');
// Adicione estas linhas para instrumentação com X-Ray
const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
// Se você estiver usando axios ou outro cliente HTTP no processamento:
// const axios = AWSXRay.captureHTTPsGlobal(require('axios'));

exports.handler = async (event) => {
  try {
    console.log(`Recebidas ${event.Records.length} mensagens para processamento`);
    
    const processamentos = event.Records.map(async (record) => {
      try {
        const body = JSON.parse(record.body);
        const { cnj, requestId } = body;
        
        console.log(`Processando CNJ: ${cnj}, RequestId: ${requestId}`);
        
        // Adicione um segmento X-Ray para rastrear cada processamento individual
        const segment = AWSXRay.getSegment();
        const subsegment = segment.addNewSubsegment(`processar-cnj-${cnj}`);
        
        try {
          const resultado = await processarCnj(cnj);
          console.log(`CNJ processado com sucesso: ${cnj}`);
          return resultado;
        } catch (error) {
          // Adicione o erro ao segmento para melhor rastreamento
          subsegment.addError(error);
          throw error;
        } finally {
          // Sempre feche o segmento, mesmo em caso de erro
          subsegment.close();
        }
      } catch (error) {
        console.error(`Erro ao processar mensagem: ${error.message}`);
        console.error(`Conteúdo da mensagem: ${record.body}`);
        
        return null;
      }
    });
    
    await Promise.all(processamentos);
    
    return {
      batchItemFailures: []
    };
  } catch (error) {
    console.error(`Erro geral no processamento: ${error.message}`);
    throw error;
  }
};