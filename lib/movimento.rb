class Movimentos < Array
  def initialize(moves_file)
    File.open(moves_file).each_line do |line|
      move = extrair_de_para(line)
      self.push(move) unless move.nil?
    end
  end
  
  def valido?(movimento)
    movimento = extrair_de_para(movimento) if movimento.kind_of? String
    self.each {|m| return true if m == movimento}
    false
  end
  
  private
  
  def extrair_de_para(str)
    move_regex = /^\s*(?<de> \d\d)\s*(?<para> \d\d)\s*$/x
    match_result = move_regex.match(str)
    [match_result[:de], match_result[:para]] unless match_result.nil?
  end
end

class Array
  def de
    self[0]
  end
  
  def para
    self[1]
  end
end