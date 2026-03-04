import { useEffect, useState } from 'react';
import { api } from '../../Services/api';
import { FormVenda } from './FormVenda';

export function Vendas() {
  // Definindo o estado 'vendas' para que ele possa ser usado nos cálculos abaixo
  const [vendas, setVendas] = useState([]);

  function carregarVendas() {
    api.get('/vendas')
      .then(res => setVendas(res.data))
      .catch(err => console.error("Erro ao carregar vendas:", err));
  }

  // useEffect(() => {
  //   carregarVendas();
  // }, []);

//    useEffect(() => {
//   api.get('/').then(res => {
//     setVendas(res.data.vendas || []); 
//   });
// }, []);

useEffect(() => {
  api.get('/') // No JSONBin usamos a raiz '/'
    .then(res => {
      // Graças ao X-Bin-Meta: false, os dados vêm diretos
      setVendas(res.data.vendas || []); 
    })
    .catch(err => console.error("Erro AGROVIDA:", err));
}, []);

  // AGORA A VARIÁVEL 'vendas' EXISTE AQUI DENTRO DO COMPONENTE
  const faturamentoTotal = vendas.reduce((acc, curr) => acc + (Number(curr.valorTotal) || 0), 0);
  const totalPedidos = vendas.length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-green-800 border-b-4 border-green-600 inline-block">
        Operação e Finanças
      </h1>

      {/* 📊 Dashboard de Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border-l-8 border-green-600 p-6 rounded-xl shadow-lg">
          <p className="text-xs text-gray-400 uppercase font-bold mb-1">Faturamento Bruto</p>
          <p className="text-4xl font-black text-green-700">
            R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white border-l-8 border-blue-600 p-6 rounded-xl shadow-lg">
          <p className="text-xs text-gray-400 uppercase font-bold mb-1">Volume de Pedidos</p>
          <p className="text-4xl font-black text-blue-700">{totalPedidos} Vendas</p>
        </div>
      </div>

      {/* 🛒 Área de Input */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-gray-600 mb-4 uppercase">Nova Operação de Venda</h2>
        <FormVenda onVendaRealizada={carregarVendas} />
      </section>

      {/* 📋 Tabela de Histórico */}
      <section>
        <h2 className="text-lg font-bold text-gray-600 mb-4 uppercase">Histórico de Movimentações</h2>
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 uppercase text-xs">Data</th>
                <th className="p-4 uppercase text-xs">Cliente</th>
                <th className="p-4 uppercase text-xs">Insumo</th>
                <th className="p-4 uppercase text-xs text-center">Qtd</th>
                <th className="p-4 uppercase text-xs text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map(v => (
                <tr key={v.id} className="hover:bg-green-50 border-b border-gray-100">
                  <td className="p-4 text-sm text-gray-400">{v.data || '---'}</td>
                  <td className="p-4 font-bold text-gray-700">{v.clienteNome}</td>
                  <td className="p-4 text-gray-600">{v.produtoNome}</td>
                  <td className="p-4 text-center text-gray-600">{v.quantidade}</td>
                  <td className="p-4 text-right font-black text-green-600">
                    R$ {Number(v.valorTotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}