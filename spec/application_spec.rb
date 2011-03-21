require 'spec_helper' 

set :environment, :test

describe 'Application Controller' do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  it "deve mostra a home do Resta 1" do
    get '/'
    last_response.should be_ok
    last_response.body.should include('Resta 1')
  end
  
  describe :movimentos do
    it "deve retornar um lista de movimentos de acordo como descrito no domcumento de movimentos" do
      criar_movimentos_txt("01 02 03\n03 02 01")
      movimentos = Movimentos.new("movimentos.txt")
      Movimentos.should_receive(:new).and_return(movimentos)
      
      get '/movimentos' 
      
      last_response.should be_ok
      json = JSON.parse(last_response.body)
      json[0].should == ['01', '02', '03']
      json[1].should == ['03', '02', '01']
      
      apagar_movimentos_txt
    end
  end
end