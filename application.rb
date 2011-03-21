require 'rubygems'
require 'sinatra'
require 'movimento'
require 'helpers'
require 'json'

# root page
get '/' do
  @message = 'Hello World!'
  erb :index
end

get '/movimentos' do
  movimentos = Movimentos.new "doc/movimentos.txt"
  movimentos.to_json
end