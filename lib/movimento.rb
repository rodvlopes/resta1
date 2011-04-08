# coding: utf-8
class Movimentos < Array
  def initialize(moves_file)
    File.open(moves_file, :encoding => 'UTF-8').each_line do |line|
      move = extrair_de_para(line)
      self.push(move) unless move.nil?
    end
  end
  
  def valido?(movimento)
    self.each {|m| return true if m.de == movimento.de and m.para == movimento.para}
    false
  end
  


  private
  
  def extrair_de_para(str)
    move_regex = /^\s*(?<de> \d\d)\s*(?<meio> \d\d)\s*(?<para> \d\d)\s*$/x
    match_result = move_regex.match(str)
    [match_result[:de], match_result[:meio], match_result[:para]] unless match_result.nil?
  end
end

class Array
  def de
    self[0]
  end
  
  def meio
    raise "Não há peça no meio." if size < 3
    self[1]
  end
  
  def para
    return self[1] if size == 2
    self[2]
  end
end