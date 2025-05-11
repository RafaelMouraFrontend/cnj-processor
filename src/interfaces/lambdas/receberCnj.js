const { isValidCNJ } = require('../../domain/cnj');
const AWS = require('aws-sdk'); // Adicione esta linha
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const cnj = body.cnj;
    
    console.log(`Recebida solicitação para processar CNJ: ${cnj}`);
    
    if (!cnj || !isValidCNJ(cnj)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: "CNJ inválido. Formato esperado: NNNNNNN-DD.AAAA.J.TR.OOOO" 
        })
      };
    }
    
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    const queueUrl = process.env.FILA_PROCESSAMENTO_URL;
    await sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({ cnj, requestId }),
      MessageAttributes: {
        RequestId: {
          DataType: 'String',
          StringValue: requestId
        }
      }
    }).promise();
    
    return {
      statusCode: 202,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: "Solicitação recebida para processamento",
        requestId: requestId
      })
    };
  } catch (error) {
    console.error("Erro:", error);
    
    console.error(`Detalhes do erro: ${JSON.stringify(error)}`);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: "Erro interno ao processar solicitação",
        errorId: `err-${Date.now()}`
      })
    };
  }
};