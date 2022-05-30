#ruby test.rb -o $IP -p $PORT
require 'sinatra'

get '/hi' do
  "Hello World!"
end

