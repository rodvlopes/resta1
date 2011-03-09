# coding: utf-8
require 'spec_helper'

describe Movimento do
  after do
    apagar_movimentos_txt
  end
  
  context "caixa branca" do
  
    it "deve ler um movimento contido no arquivo de movimentos passado na inicialização" do
      criar_movimentos_txt "1A: 01 02"
      movimento = Movimento.new 'movimentos.txt'
      movimento['1A'].should == ['01', '02']
    end
    
    it "deve ler uma lista contida no arquivo de movimentos passado na inicialização" do
      criar_movimentos_txt <<EOS
1A: 01 02
2A: 11 22
0G: 03 92
EOS
      movimento = Movimento.new 'movimentos.txt'
      movimento['1A'].should == ['01', '02']
      movimento['2A'].should == ['11', '22']
      movimento['0G'].should == ['03', '92']
    end
    
    it "deve ler uma lista com diferentes espaçamentos" do
      criar_movimentos_txt <<EOS
  1A:0102
  2A      : 11 22
0G: 03    92
EOS
      movimento = Movimento.new 'movimentos.txt'
      movimento['1A'].should == ['01', '02']
      movimento['2A'].should == ['11', '22']
      movimento['0G'].should == ['03', '92']
    end
  
    it "deve aceitar um arquivo com linhas que não sejam movimentos" do
      criar_movimentos_txt <<EOS
Rodrigo Foi Testar Um arquivo e 
Falhou
   00
00 11 00
   00      
1A:0102
2A: 11 22
0G: 03    92

Teste 00 : Teste
EOS
      movimento = Movimento.new 'movimentos.txt'
      movimento['1A'].should == ['01', '02']
      movimento['2A'].should == ['11', '22']
      movimento['0G'].should == ['03', '92']
      movimento.length.should == 3
      movimento.size.should   == 3
    end
  end
  
  
  context "validação real" do

    it "os quadrantes 1,2,4,5 devem conter o mesmo número de movimentos" do
      movimento = Movimento.new 'doc/movimentos.txt'
      c1, c2, c4, c5 = 0, 0, 0, 0
      movimento.keys.each do |k|
        c1 =+ 1 if k =~ /1./
        c2 =+ 1 if k =~ /2./
        c4 =+ 1 if k =~ /4./
        c5 =+ 1 if k =~ /5./
      end

      c1.should > 0
      c1.should == c2
      c2.should == c4
      c4.should == c5
    end
     
    it "para todo movimento de-para deve existir um movimento para-de" do
      movimento = Movimento.new 'doc/movimentos.txt'
      movimento.each do |k, m|
        outro_m = [m.para, m.de]
        encontrei = false
        movimento.values.each {|m2| 
          if m2 == outro_m
            encontrei = true
            break
          end
        }
        encontrei.should be_true
      end
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