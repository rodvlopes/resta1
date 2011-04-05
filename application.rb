# coding: utf-8
$: << "."
require 'rubygems'
require "bundler/setup"
require 'sinatra'
require 'lib/movimento'
require 'lib/helpers'
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