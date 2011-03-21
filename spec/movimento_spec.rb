# coding: utf-8
require 'spec_helper'

describe Movimentos do
  after do
    apagar_movimentos_txt
  end
  
  context "caixa branca" do
  
    it "deve ler um movimento contido no arquivo de movimentos passado na inicialização" do
      criar_movimentos_txt "01 02 03"
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?(['01', '03']).should be_true
      movimentos.valido?(['03', '05']).should be_false
    end
    
    it "deve ler uma lista contida no arquivo de movimentos passado na inicialização" do
      criar_movimentos_txt <<EOS
01 02 03
11 22 33
03 92 15
EOS
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?(['01', '03']).should be_true
      movimentos.valido?(['11', '33']).should be_true
      movimentos.valido?(['03', '15']).should be_true
      movimentos.valido?(['55', '66']).should be_false
    end
    
    it "deve ler uma lista com diferentes espaçamentos" do
      criar_movimentos_txt <<EOS
  010203
          11 22 33
03    92              15
EOS
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?(['01', '03']).should be_true
      movimentos.valido?(['11', '33']).should be_true
      movimentos.valido?(['03', '15']).should be_true
      movimentos.valido?(['55', '66']).should be_false
    end
  
    it "deve aceitar um arquivo com linhas que não sejam movimentos" do
      criar_movimentos_txt <<EOS
Rodrigo Foi Testar Um arquivo e 
Falhou
|   00
|00 11 00
|   00      
010203
11 22 33
03    92 15

Teste 00 : Teste
EOS
      movimentos = Movimentos.new 'movimentos.txt'
      movimentos.valido?(['01', '03']).should be_true
      movimentos.valido?(['11', '33']).should be_true
      movimentos.valido?(['03', '15']).should be_true
      movimentos.valido?(['55', '66']).should be_false
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

    it "para todo movimento de-para deve existir uma peça no meio" do
      movimentos = Movimentos.new 'doc/movimentos.txt'
      movimentos.each { |m| m.meio.to_i.should > 0 }
    end
    
    it "entre um de-para PAR tem que ter um meio ÍMPAR e vice-versa" do
      movimentos = Movimentos.new 'doc/movimentos.txt'
      movimentos.each do |m| 
        m.meio.to_i.odd?.should be_true if m.de.to_i.even? 
        m.meio.to_i.even?.should be_true if m.de.to_i.odd? 
      end
    end
 end
end
