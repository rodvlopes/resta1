# coding: utf-8
require 'spec_helper'

describe Movimentos do
  after do
    apagar_movimentos_txt
  end
  
  context "caixa branca" do
  
    it "deve ler um movimento contido no arquivo de movimentos passado na inicialização" do
      criar_movimentos_txt "01 02"
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?('0102').should be_true
      movimentos.valido?('0402').should be_false
    end
    
    it "deve ler uma lista contida no arquivo de movimentos passado na inicialização" do
      criar_movimentos_txt <<EOS
01 02
11 22
03 92
EOS
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?('0102').should be_true
      movimentos.valido?('1122').should be_true
      movimentos.valido?('0392').should be_true
      movimentos.valido?('3333').should be_false
    end
    
    it "deve ler uma lista com diferentes espaçamentos" do
      criar_movimentos_txt <<EOS
  0102
          11 22
03    92
EOS
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?('0102').should be_true
      movimentos.valido?('1122').should be_true
      movimentos.valido?('0392').should be_true
      movimentos.valido?('3333').should be_false
    end
  
    it "deve aceitar um arquivo com linhas que não sejam movimentos" do
      criar_movimentos_txt <<EOS
Rodrigo Foi Testar Um arquivo e 
Falhou
   00
00 11 00
   00      
0102
11 22
03    92

Teste 00 : Teste
EOS
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?('0102').should be_true
      movimentos.valido?('1122').should be_true
      movimentos.valido?('0392').should be_true
      movimentos.valido?('0011').should be_false
      movimentos.length.should == 3
      movimentos.size.should   == 3
    end
  end
  
  
  context "validação real" do

    it "para todo movimento de-para deve existir um movimento para-de" do
      movimentos = Movimentos.new 'doc/movimentos.txt'
      movimentos.length.should > 0
      movimentos.each { |m| movimentos.valido?([m.para, m.de]).should be_true }
    end

 end
end





#helper methods

def criar_movimentos_txt(conteudo)
    File.open('movimentos.txt', 'w') { |f| f.puts conteudo }
end

def apagar_movimentos_txt
  begin
    File.delete 'movimentos.txt'
  rescue
  end
end