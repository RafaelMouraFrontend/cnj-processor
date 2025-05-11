function isValidCNJ(cnj) {
    const regex = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/;
    return regex.test(cnj);
  }
  
  class CNJ {
    constructor(numero) {
      if (!isValidCNJ(numero)) {
        throw new Error('Formato de CNJ inválido');
      }
      this.numero = numero;
    }
    
    toString() {
      return this.numero;
    }
  }
  
  module.exports = {
    CNJ,
    isValidCNJ
  };