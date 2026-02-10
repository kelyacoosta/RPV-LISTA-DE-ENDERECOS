import { useState } from 'react'
import './App.css'

interface IErro {
  active: boolean
  description: string
}

interface IEndereco {
  id: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

interface IAjustarEndereco {
  id: string,
  tipo: "EXCLUIR"
}

export function App() {
  const [logradouro, setLogradouro] = useState<string>("")
  const [numero, setNumero] = useState<string>("")
  const [bairro, setBairro] = useState<string>("")
  const [cidade, setCidade] = useState<string>("")
  const [estado, setEstado] = useState<string>("")
  const [cep, setCep] = useState<string>("")
  const [enderecos, setEnderecos] = useState<IEndereco[]>([])
  const [erro, setErro] = useState<IErro>({
    active: false,
    description: ""
  })
  const [mostrarModal, setMostrarModal] = useState<boolean>()
  const [idEnderecoSelecionado, setIdEnderecoSelecionado] = useState<string>("")

  function adicionarEndereco(): void {
    if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) {
      setErro({
        active: true,
        description: "Todos os campos são obrigatórios."
      })
      return
    }

    if (!/^\d{8}$/.test(cep)) {
      setErro({
        active: true,
        description: "O CEP deve ter 8 números."
      })
      return
    }

    const enderecoJaCadastrado = enderecos.filter(
      endereco =>
        endereco.logradouro.trim().toLowerCase() === logradouro.trim().toLowerCase() &&
        endereco.numero.trim() === numero.trim()
    )

    if (enderecoJaCadastrado.length > 0) {
      setErro({
        active: true,
        description: "Endereço já cadastrado."
      })
      return
    }

    const novoEndereco: IEndereco = {
      id: Math.random().toString(36).substring(2, 9),
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      cep
    }

    setEnderecos(oldState => [...oldState, novoEndereco])


    setLogradouro("")
    setNumero("")
    setBairro("")
    setCidade("")
    setEstado("")
    setCep("")
    setErro({ active: false, description: "" })
  }

  function ajustarEndereco({ id, tipo }: IAjustarEndereco): void {
    if (tipo === "EXCLUIR") {
      const novoArray = enderecos.filter(endereco => endereco.id !== id)
      setEnderecos(novoArray)
    }
  }

  function abrirModal(id: string): void {
    setIdEnderecoSelecionado(id)
    setMostrarModal(!mostrarModal)
  }

  return (
    <>
      <div className="card">
        <div className='input-wrapper'>
          <input placeholder='Logradouro' value={logradouro} onChange={e => setLogradouro(e.target.value)} />
          <input placeholder='Número' value={numero} onChange={e => setNumero(e.target.value)} />
          <input placeholder='Bairro' value={bairro} onChange={e => setBairro(e.target.value)} />
          <input placeholder='Cidade' value={cidade} onChange={e => setCidade(e.target.value)} />
          <input placeholder='Estado' value={estado} onChange={e => setEstado(e.target.value)} />
          <input placeholder='CEP' value={cep} onChange={e => setCep(e.target.value)} />
          <p className='erro'>{erro.active && erro.description}</p>
        </div>
        <button onClick={adicionarEndereco}>Cadastrar Endereço</button>
      </div>

      <ul>
        {
          enderecos.map((endereco) => (
            <div className='item-list' key={endereco.id}>
              <li>
                {endereco.logradouro}, {endereco.numero} - {endereco.bairro} - {endereco.cidade}/{endereco.estado} - CEP: {endereco.cep}
              </li>
              <button onClick={() => abrirModal(endereco.id)}>Excluir</button>
            </div>
          ))
        }
      </ul>

      {mostrarModal === true && (
        <div className='modal-wrapper'>
          <div className="modal">
            <h1>Confirmação</h1>
            <h3>Deseja realmente excluir este endereço?</h3>
            <div className='modal-buttons'>
              <button onClick={() => setMostrarModal(false)}>NÃO</button>
              <button onClick={() => {
                ajustarEndereco({ id: idEnderecoSelecionado, tipo: "EXCLUIR" })
                setMostrarModal(false)
              }}>SIM</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
