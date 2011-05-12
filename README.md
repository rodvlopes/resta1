Resta 1 Algorítimo Genético
===========================

Descrição
---------

O objetivo deste trabalho é escrever uma solução via algorítmo genético
para resolver o problema do jogo Resta 1.

DEMO
----

http://resta1.rodrigovitoria.com/

Features
--------

- Resta 1 em javascript (componentizado)
- API de Algorítimo Genético (AG) em Javascript
- API AG para execução em paralelo com diversos browsers


Instalação
----------

1. Clonar o repositório, ter o ruby instalado e o bundler;
2. Rodar o bundler para instalar as gems;
3. Subir o servidor com o comando _rackup_;
4. Acessar localhost:9292.


ANDAMENTO
=========

Backlog (priorizado)
--------------------

- *Task*: Iniciar a execução do AG e ver os indivíduos de cada geração


Done
----

- _11/05/2011_ | *Task*: Implementar html/css básico para o AG
- _10/05/2011_ | *Task*: Planejar a implementação do algoritmo genético
- _09/05/2011_ | *Refactor*: Adicionar método para recuperar os movimentos executados na instância
- _09/05/2011_ | *Bug*: Sequência falha: 19>17 30>18 27>25 13>27 24>26 22>24 08>22 21>23 23>25 07>21 31>23 32>24 18>30 33>25 24>22 10>24 25>23 12>10 09>11 23>09 21>23 27>25 
- _08/05/2011_ | *Task*: JQuerificar o Resta1 (tornar um plugin)
- _06/05/2011_ | *Task*: Tirar o desenho do jogo da home e substitui-lo por um instância do tabuleiro (não jogável)
- _06/05/2011_ | *Task*: Permitir temificação do tabuleiro
- _06/05/2011_ | *Task*: Criar o modo não jogável, com estado inicial customizado
- _06/05/2011_ | *Refactor*: Tirar a lista de movimentos do backend
- _05/05/2011_ | *Refactor*: Colocar o html do tabuleiro como sendo o default do componente (trazer para dentro)


Brainstorm AG
-------------

Configurações: 
	- Tamanho da população
	- Função Afinidade (estudar possibilidades)
	- Taxas de mutação e crossover
	
Ações:
	- Pausar execução
	- Exibir indivíduos da geraração atual
	- Indivíduos exibidos na tela são executáveis no palco
	
Visualizar:
	- Lista de indivíduos de uma geração com sua fitness
	- Gráfico de evolução (fitness média / fitness melhor x geração)