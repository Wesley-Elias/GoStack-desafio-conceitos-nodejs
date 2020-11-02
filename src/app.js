const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories); // Lista todos os repositórios
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body; // Corpo da requisição
  const repository = { // Objeto
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0,
  };
  
  repositories.push(repository); // Adiciona o objeto recém criado à lista de repositórios

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body; // Corpo da requisição
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); // Procura no Array de repositórios qual o repositório que tem o mesmo ID do parâmetro da rota
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository does not exists.'}) // Caso não ache o repositório, será exibido uma mensagem de erro
  }
  const repository = { // Sobrescrever os valores repositório
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };
  
  repositories[repositoryIndex] = repository;

  return response.json(repository); 
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id); // Procura no Array de repositórios qual o repositório que tem o mesmo ID do parâmetro da rota
  if(repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1); // Se achar o repositório, ele será deletado
  } else {
    return response.status(400).json({error: 'Repository does not exists.'}); // Se não achar, retorna a mensagem de Repositório
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex === -1){
    return response.status(400).json({ error: 'Repository does not exists.'}) // Caso não ache o repositório, será exibido uma mensagem de erro
  }

  repositories[repositoryIndex].likes++;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
