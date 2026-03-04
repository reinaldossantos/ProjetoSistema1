import { useState, useEffect } from 'react';
import { api } from '../../Services/api';
import { toast } from 'sonner';

export function FormVenda({ onVendaRealizada }) {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [venda, setVenda] = useState({ clienteId: '', produtoId: '', quantidade: 1 });

  // Carrega os dados iniciais do JSONBin
  useEffect(() => {
    api.get('/').then(res => {
      setClientes(res.data.clientes || []);
      setProdutos(res.data.produtos || []);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      // 1. Busca o banco completo para não apagar dados do Fabricio ou Jadean
      const resposta = await api.get('/');
      const bancoCompleto = resposta.data;

      // 2. Localiza os nomes dos itens selecionados
      const clienteEncontrado = clientes.find(c => c.id === Number(venda.clienteId));
      const produtoEncontrado = produtos.find(p => p.id === Number(venda.produtoId));

      if (!clienteEncontrado || !produtoEncontrado) {
        toast.error("Selecione um cliente e um produto válidos!");
        return;
      }

      // 3. Prepara a nova venda (Calculando o total para a Marcilene)
      const novaVenda = {
        id: Date.now(),
        clienteNome: clienteEncontrado.nomeFazenda,
        produtoNome: produtoEncontrado.nome,
        quantidade: Number(venda.quantidade),
        valorTotal: produtoEncontrado.preco * Number(venda.quantidade),
        data: new Date().toLocaleDateString('pt-BR')
      };

      // 4. Atualiza apenas a gaveta de vendas no "baú" completo
      const bancoAtualizado = {
        ...bancoCompleto,
        vendas: [...(bancoCompleto.vendas || []), novaVenda]
      };

      // 5. Salva o banco inteiro atualizado no JSONBin
      await api.put('/', bancoAtualizado);
      
      toast.success("Venda registrada com sucesso!");
      setVenda({ clienteId: '', produtoId: '', quantidade: 1 }); // Limpa campos
      onVendaRealizada();
      
    } catch {
      toast.error("Erro ao processar venda no servidor.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm font-bold text-gray-700">Cliente</label>
        <select 
          required
          className="w-full border p-2 rounded"
          value={venda.clienteId}
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
          value={venda.produtoId}
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

      <button className="bg-green-600 text-white font-bold p-2 rounded hover:bg-green-700 transition-colors">
        Finalizar Venda
      </button>
    </form>
  );
}