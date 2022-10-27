import { useEffect, useState } from "react";
import { Professor } from "../@types/professor";
import { ApiService } from "../services/ApiService";

// criar a lista de professores com hooks
export function useIndex() {
  const [listaProfessores, setListaProfessores] = useState<Professor[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    ApiService.get("/professores").then((response) => {
      setListaProfessores(response.data);
    });
  }, []);

  useEffect (() => {
    limpaForms();
  }, [professorSelecionado]);

  function marcarAula() {
    if (professorSelecionado !== null) {
      if(validarDadosAula()) {
        ApiService.post('/professores/' + professorSelecionado.id + '/aulas', {
          nome,
          email
        }).then(() => {
          setProfessorSelecionado(null);
          setMensagem('Aula marcada com sucesso!');  
        }).catch((erro) => {
          setMensagem(erro.response?.data.message);
        }); 
      } else {
        setMensagem('Preencha todos os campos');
      }
    }
  
  }

  function validarDadosAula() {
    return nome.length > 0 && email.length;
  }

  function limpaForms() {
    setNome('');
    setEmail('');
  }

  return {
    listaProfessores,
    nome,
    setNome,
    email,
    setEmail,
    professorSelecionado,
    setProfessorSelecionado,
    marcarAula,
    mensagem,
    setMensagem,
    limpaForms
  }
}