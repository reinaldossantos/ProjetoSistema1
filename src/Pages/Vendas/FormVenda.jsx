import { useState, useEffect } from 'react';
import { api } from '../../Services/api';
import { toast } from 'sonner';

export function FormVenda({ onVendaRealizada }) {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [venda, setVenda] = useState({ clienteId: '', produtoId: '', quantidade: 1 });

//   Carrega os dados necessários para os "Selects"
//   useEffect(() => {
//     api.get('/clientes').then(res => setClientes(res.data));
//     api.get('/produtos').then(res => setProdutos(res.data));
//   }, []);

useEffect(() => {
  // Busca os clientes 
  api.get('/clientes')
    .then(res => setClientes(res.data))
    .catch(err => console.error("Erro ao buscar clientes no form:", err));

  // Busca os produtos
  api.get('/produtos')
    .then(res => setProdutos(res.data))
    .catch(err => console.error("Erro ao buscar produtos no form:", err));
}, []);

  // async function handleSubmit(e) {
  //   e.preventDefault();
    
  //   // Busca os nomes para salvar no histórico (Denormalização para facilitar o relatório financeiro)
  //   const cliente = clientes.find(c => c.id === venda.clienteId);
  //   const produto = produtos.find(p => p.id === venda.produtoId);
  //   const valorTotal = produto.preco * venda.quantidade;

  //   const novaVenda = {
  //     clienteNome: cliente.nomeFazenda,
  //     produtoNome: produto.nome,
  //     quantidade: Number(venda.quantidade),
  //     valorTotal: valorTotal,
  //     data: new Date().toLocaleDateString()
  //   };

  //   await api.post('/vendas', novaVenda);
  //   toast.success("Venda registrada com sucesso!");
  //   onVendaRealizada(); // Atualiza a lista automaticamente
  // }

  async function handleSubmit(e) {
  e.preventDefault();
  
  // 1. Primeiro, buscamos o "baú" completo do JSONBin
  const resposta = await api.get('/');
  const bancoCompleto = resposta.data;

  // 2. Preparamos a nova venda
  const novaVenda = { 
    id: Date.now(), // Gerando um ID único manualmente
    clienteNome: cliente Selecionado, 
    /* ... outros campos ... */ 
  };

  // 3. Atualizamos APENAS a gaveta de vendas, mantendo o resto
  const bancoAtualizado = {
    ...bancoCompleto,
    vendas: [...(bancoCompleto.vendas || []), novaVenda]
  };

  // 4. Enviamos o baú inteiro de volta usando PUT
  await api.put('/', bancoAtualizado);
  
  toast.success("Venda registrada na nuvem!");
  onVendaRealizada();
}

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm font-bold text-gray-700">Cliente</label>
        <select 
          required
          className="w-full border p-2 rounded"
          onChange={e => setVenda({...venda, clienteId: e.target.value})}
        >
          <option value="">Selecione o Cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nomeFazenda}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">Produto</label>
        <select 
          required
          className="w-full border p-2 rounded"
          onChange={e => setVenda({...venda, produtoId: e.target.value})}
        >
          <option value="">Selecione o Insumo</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">Quantidade</label>
        <input 
          type="number" 
          min="1"
          className="w-full border p-2 rounded"
          value={venda.quantidade}
          onChange={e => setVenda({...venda, quantidade: e.target.value})}
        />
      </div>

      <button className="bg-green-600 text-white font-bold p-2 rounded hover:bg-green-700">
        Finalizar Venda
      </button>
    </form>
  );
}