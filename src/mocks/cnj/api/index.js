exports.handler = async (event) => {
	console.log('Evento recebido:', JSON.stringify(event));
	
	const numeroCnj = event.pathParameters?.cnj || "0000000-00.0000.0.00.0000";
	
	console.log(`Consultando mock para CNJ: ${numeroCnj}`);
	
	const digitos = numeroCnj.replace(/[^0-9]/g, '');
	const ultimoDigito = parseInt(digitos.slice(-1)) || 0;
	
	let resposta;
	switch (ultimoDigito % 4) {
			case 0:
					resposta = {
							status: 'EM_ANDAMENTO',
							tribunal: 'TJSP',
							vara: '5ª Vara Cível',
							classe: 'Procedimento Comum',
							assunto: 'Indenização por Dano Material',
							dataDistribuicao: '2022-03-15',
							partes: [
									{ tipo: 'AUTOR', nome: 'João Silva' },
									{ tipo: 'REU', nome: 'Empresa ABC Ltda' }
							]
					};
					break;
			
			case 1:
					resposta = {
							status: 'ARQUIVADO',
							tribunal: 'TJRJ',
							vara: '2ª Vara Criminal',
							classe: 'Ação Penal',
							assunto: 'Furto',
							dataDistribuicao: '2021-07-22',
							dataArquivamento: '2023-01-10',
							partes: [
									{ tipo: 'AUTOR', nome: 'Ministério Público' },
									{ tipo: 'REU', nome: 'Pedro Santos' }
							]
					};
					break;
			
			case 2:
					resposta = {
							status: 'SUSPENSO',
							tribunal: 'TJMG',
							vara: '3ª Vara de Família',
							classe: 'Divórcio Litigioso',
							assunto: 'Dissolução de Casamento',
							dataDistribuicao: '2023-04-05',
							dataSuspensao: '2023-11-30',
							motivoSuspensao: 'Tentativa de Conciliação',
							partes: [
									{ tipo: 'AUTOR', nome: 'Maria Souza' },
									{ tipo: 'REU', nome: 'Carlos Souza' }
							]
					};
					break;
			
			case 3:
					resposta = {
							status: 'JULGADO',
							tribunal: 'TRF1',
							vara: '1ª Vara Federal',
							classe: 'Mandado de Segurança',
							assunto: 'Direito Administrativo',
							dataDistribuicao: '2020-09-18',
							dataJulgamento: '2022-08-25',
							resultadoJulgamento: 'PROCEDENTE',
							partes: [
									{ tipo: 'IMPETRANTE', nome: 'Construtora XYZ S.A.' },
									{ tipo: 'IMPETRADO', nome: 'Presidente da Autarquia Federal' }
							]
					};
					break;
					
			default:
					resposta = { 
							status: 'EM_ANDAMENTO', 
							tribunal: 'TJDF',
							vara: '1ª Vara Cível',
							observacao: 'Dados padrão para caso não previsto'
					};
	}
	
	await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
	
	return {
			statusCode: 200,
			headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'  
			},
			body: JSON.stringify(resposta)
	};
};