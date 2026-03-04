import { useEffect, useState } from 'react';
import { api } from '../../Services/api';
import { FormProduto } from './FormProduto';
import { toast } from 'sonner';

export function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]); // Precisamos carregar as vendas para validar

  function carregarDados() {
    api.get('/produtos').then(res => setProdutos(res.data));
    api.get('/vendas').then(res => setVendas(res.data));
  }

  // useEffect(() => {
  //   carregarDados();
  // }, []);

  useEffect(() => {
  api.get('/') // No JSONBin, como o ID já está na URL base, usamos apenas '/'
    .then(res => {
      // O JSONBin coloca seus dados dentro de 'record'
      setProdutos(res.data.record.produtos); 
    })
    .catch(err => console.error(err));
}, []);


  async function excluirProduto(id, nome) {
    // REGRA DE NEGÓCIO: Verifica se o produto já foi vendido
    const jaVendido = vendas.some(v => v.produtoNome === nome);

    if (jaVendido) {
      toast.error("Não é possível excluir: Este produto possui vendas registradas!");
      return;
    }

    if (window.confirm(`Deseja realmente excluir o produto ${nome}?`)) {
      await api.delete(`/produtos/${id}`);
      toast.success("Produto removido com sucesso!");
      carregarDados();
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-green-800 mb-8">Gestão de Estoque</h1>
      <FormProduto onProdutoCadastrado={carregarDados} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.map((p) => (
          <div key={p.id} className="p-6 border rounded-2xl shadow-sm bg-white relative group">
            <button 
              onClick={() => excluirProduto(p.id, p.nome)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Excluir Produto"
            >
              Excluir
            </button>
            <h3 className="font-bold text-xl text-gray-800">{p.nome}</h3>
            <p className="text-2xl font-black text-green-700 mb-4">R$ {p.preco?.toFixed(2)}</p>
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Estoque</span>
              <span className="font-black text-gray-700">{p.estoque} un</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}