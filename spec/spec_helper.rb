# coding: utf-8
$: << "."
require 'movimento'
require 'application'
require 'rspec'
require 'rack/test'


def criar_movimentos_txt(conteudo)
    File.open('movimentos.txt', 'w') { |f| f.puts conteudo }
end

def apagar_movimentos_txt
  begin
    File.delete 'movimentos.txt'
  rescue
  end
end