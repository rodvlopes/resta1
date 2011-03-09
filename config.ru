$: << "."
require 'application'

# log = File.new("sinatra.log", "a")
# log.sync = true
# STDOUT.reopen(log)
# STDERR.reopen(log)

run Sinatra::Application

#RACK_ENV env must be set on production envioment