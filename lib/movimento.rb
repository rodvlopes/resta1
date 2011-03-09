class Movimento < Hash
  def initialize(moves_file)
    File.open(moves_file).each_line do |line|
      move_regex = /(?<key> \d\S)\s*:\s*(?<de> \d\d)\s*(?<para> \d\d)/x
      match_result = move_regex.match(line)
      self[match_result[:key]] = [match_result[:de], match_result[:para]] unless match_result.nil?
    end
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