Resta 1 Algorítimo Genético
==================================

Descrição
----------------------------------------------

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

BACKLOG (PRIORIZADO)
--------------------

- Bug: Sequência falha: 19>17 30>18 27>25 13>27 24>26 22>24 08>22 21>23 23>25 07>21 31>23 32>24 18>30 33>25 24>22 10>24 25>23 12>10 09>11 23>09 21>23 27>25 
- JQuerificar o Resta1 (tornar um plugin)


DONE
----
- _05/05/2011_ Colocar o html do tabuleiro como sendo o default do componente (trazer para dentro)
- _06/05/2011_ Tirar a lista de movimentos do backend
- _06/05/2011_ Criar o modo não jogável, com estado inicial customizado
- _06/05/2011_ Permitir temificação do tabuleiro
- _06/05/2011_ Tirar o desenho do jogo da home e substitui-lo por um instância do tabuleiro (não jogável)
