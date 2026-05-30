"use client"
import { useState, useEffect } from "react"

type Conta = { id: string; cpf: string; nome: string; senha: string; telefone?: string; moedas?: number; xp?: number; nivel?: number }
type Loja = { id: string; nome: string; tipo?: string; raridade?: string; preco: number }
type Inventario = { id: string; conta_id: string; item_id: string; equipado: boolean; conta?: Conta; loja?: Loja }

export default function Home() {
  const [aba, setAba] = useState<"conta"|"loja"|"inventario">("conta")
  const [contas, setContas] = useState<Conta[]>([])
  const [novaContaForm, setNovaContaForm] = useState({ cpf:"", nome:"", senha:"", telefone:"", moedas:0, xp:0, nivel:1 })
  const [editConta, setEditConta] = useState<Conta|null>(null)
  const [itens, setItens] = useState<Loja[]>([])
  const [novoItemForm, setNovoItemForm] = useState({ nome:"", tipo:"", raridade:"", preco:0 })
  const [editItem, setEditItem] = useState<Loja|null>(null)
  const [inventario, setInventario] = useState<Inventario[]>([])
  const [novoInvForm, setNovoInvForm] = useState({ conta_id:"", item_id:"", equipado:false })

  useEffect(() => { fetchContas(); fetchItens(); fetchInventario() }, [])

  async function fetchContas() { const r = await fetch("/api/conta"); setContas(await r.json()) }
  async function fetchItens() { const r = await fetch("/api/loja"); setItens(await r.json()) }
  async function fetchInventario() { const r = await fetch("/api/inventario"); setInventario(await r.json()) }

  async function criarConta() {
    await fetch("/api/conta", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(novaContaForm) })
    setNovaContaForm({ cpf:"", nome:"", senha:"", telefone:"", moedas:0, xp:0, nivel:1 }); fetchContas()
  }
  async function atualizarConta() {
    if (!editConta) return
    await fetch(`/api/conta/${editConta.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(editConta) })
    setEditConta(null); fetchContas()
  }
  async function deletarConta(id: string) { await fetch(`/api/conta/${id}`, { method:"DELETE" }); fetchContas() }
  async function criarItem() {
    await fetch("/api/loja", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(novoItemForm) })
    setNovoItemForm({ nome:"", tipo:"", raridade:"", preco:0 }); fetchItens()
  }
  async function atualizarItem() {
    if (!editItem) return
    await fetch(`/api/loja/${editItem.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(editItem) })
    setEditItem(null); fetchItens()
  }
  async function deletarItem(id: string) { await fetch(`/api/loja/${id}`, { method:"DELETE" }); fetchItens() }
  async function criarInventario() {
    await fetch("/api/inventario", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(novoInvForm) })
    setNovoInvForm({ conta_id:"", item_id:"", equipado:false }); fetchInventario()
  }
  async function deletarInventario(id: string) { await fetch(`/api/inventario/${id}`, { method:"DELETE" }); fetchInventario() }

  const inp = "border-2 border-gray-300 rounded-lg px-3 py-2 text-sm w-full text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:border-indigo-500 transition"
  const btn = "px-4 py-2 rounded-lg text-sm font-semibold transition"

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Supabase CRUD</h1>
        <p className="text-gray-500 mb-6 text-sm">Gerencie contas, loja e inventario</p>

        <div className="flex gap-2 mb-8">
          {(["conta","loja","inventario"] as const).map(a => (
            <button key={a} onClick={() => setAba(a)}
              className={`${btn} ${aba===a ? "bg-indigo-600 text-white shadow-md" : "bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-400"}`}>
              {a === "conta" ? "Contas" : a === "loja" ? "Loja" : "Inventario"}
            </button>
          ))}
        </div>

        {aba === "conta" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Nova Conta</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">CPF</label>
                  <input placeholder="000.000.000-00" className={inp} value={novaContaForm.cpf} onChange={e=>setNovaContaForm({...novaContaForm,cpf:e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Nome</label>
                  <input placeholder="Nome completo" className={inp} value={novaContaForm.nome} onChange={e=>setNovaContaForm({...novaContaForm,nome:e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Senha</label>
                  <input placeholder="Senha" type="password" className={inp} value={novaContaForm.senha} onChange={e=>setNovaContaForm({...novaContaForm,senha:e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Telefone</label>
                  <input placeholder="(00) 00000-0000" className={inp} value={novaContaForm.telefone} onChange={e=>setNovaContaForm({...novaContaForm,telefone:e.target.value})}/>
                </div>
              </div>
              <button onClick={criarConta} className={`${btn} bg-indigo-600 text-white mt-4 hover:bg-indigo-700`}>+ Criar Conta</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Contas <span className="text-indigo-600">({contas.length})</span></h2>
              {contas.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhuma conta cadastrada ainda.</p>}
              <div className="space-y-2">
                {contas.map(c => (
                  <div key={c.id} className="flex items-center justify-between border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-100 transition">
                    {editConta?.id === c.id ? (
                      <div className="flex gap-2 flex-1">
                        <input className={inp} value={editConta.nome} onChange={e=>setEditConta({...editConta,nome:e.target.value})}/>
                        <input className={inp} value={editConta.telefone||""} onChange={e=>setEditConta({...editConta,telefone:e.target.value})}/>
                        <button onClick={atualizarConta} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>Salvar</button>
                        <button onClick={()=>setEditConta(null)} className={`${btn} bg-gray-200 text-gray-700 hover:bg-gray-300`}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-semibold text-gray-900">{c.nome}</p>
                          <p className="text-xs text-gray-500 mt-0.5">CPF: {c.cpf} &bull; Nv {c.nivel} &bull; {c.xp} XP &bull; {c.moedas} moedas</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>setEditConta(c)} className={`${btn} bg-amber-400 text-white hover:bg-amber-500`}>Editar</button>
                          <button onClick={()=>deletarConta(c.id)} className={`${btn} bg-red-500 text-white hover:bg-red-600`}>Deletar</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {aba === "loja" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Novo Item</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Nome</label>
                  <input placeholder="Nome do item" className={inp} value={novoItemForm.nome} onChange={e=>setNovoItemForm({...novoItemForm,nome:e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Tipo</label>
                  <input placeholder="ex: Arma, Armadura" className={inp} value={novoItemForm.tipo} onChange={e=>setNovoItemForm({...novoItemForm,tipo:e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Raridade</label>
                  <input placeholder="ex: Comum, Raro, Lendario" className={inp} value={novoItemForm.raridade} onChange={e=>setNovoItemForm({...novoItemForm,raridade:e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Preco</label>
                  <input placeholder="0" type="number" className={inp} value={novoItemForm.preco} onChange={e=>setNovoItemForm({...novoItemForm,preco:Number(e.target.value)})}/>
                </div>
              </div>
              <button onClick={criarItem} className={`${btn} bg-indigo-600 text-white mt-4 hover:bg-indigo-700`}>+ Criar Item</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Itens <span className="text-indigo-600">({itens.length})</span></h2>
              {itens.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhum item cadastrado ainda.</p>}
              <div className="space-y-2">
                {itens.map(i => (
                  <div key={i.id} className="flex items-center justify-between border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-100 transition">
                    {editItem?.id === i.id ? (
                      <div className="flex gap-2 flex-1">
                        <input className={inp} value={editItem.nome} onChange={e=>setEditItem({...editItem,nome:e.target.value})}/>
                        <input className={inp} value={editItem.preco} type="number" onChange={e=>setEditItem({...editItem,preco:Number(e.target.value)})}/>
                        <button onClick={atualizarItem} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>Salvar</button>
                        <button onClick={()=>setEditItem(null)} className={`${btn} bg-gray-200 text-gray-700 hover:bg-gray-300`}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-semibold text-gray-900">{i.nome}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{i.tipo} &bull; {i.raridade} &bull; {i.preco} moedas</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>setEditItem(i)} className={`${btn} bg-amber-400 text-white hover:bg-amber-500`}>Editar</button>
                          <button onClick={()=>deletarItem(i.id)} className={`${btn} bg-red-500 text-white hover:bg-red-600`}>Deletar</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {aba === "inventario" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Adicionar ao Inventario</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Conta</label>
                  <select className={inp} value={novoInvForm.conta_id} onChange={e=>setNovoInvForm({...novoInvForm,conta_id:e.target.value})}>
                    <option value="">Selecione a Conta</option>
                    {contas.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Item</label>
                  <select className={inp} value={novoInvForm.item_id} onChange={e=>setNovoInvForm({...novoInvForm,item_id:e.target.value})}>
                    <option value="">Selecione o Item</option>
                    {itens.map(i=><option key={i.id} value={i.id}>{i.nome}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={criarInventario} className={`${btn} bg-indigo-600 text-white mt-4 hover:bg-indigo-700`}>+ Adicionar</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Inventario <span className="text-indigo-600">({inventario.length})</span></h2>
              {inventario.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhum item no inventario ainda.</p>}
              <div className="space-y-2">
                {inventario.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between border-2 border-gray-100 rounded-xl p-4 hover:border-indigo-100 transition">
                    <div>
                      <p className="font-semibold text-gray-900">{inv.conta?.nome ?? inv.conta_id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Item: {inv.loja?.nome ?? inv.item_id} &bull; Equipado: {inv.equipado ? "Sim" : "Nao"}</p>
                    </div>
                    <button onClick={()=>deletarInventario(inv.id)} className={`${btn} bg-red-500 text-white hover:bg-red-600`}>Remover</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}