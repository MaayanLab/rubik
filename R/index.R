library(Rook)
library(Matrix)
library(jsonlite)



# prelude, Fisher exact function on input ---------------------------------

source("enrich.R")




# server start ------------------------------------------------------------

s <- Rhttpd$new()
s$start(listen='127.0.0.1')


my.app <- function(env){
  ## Start with a table and allow the user to upload a CSV-file
  req <- Request$new(env)
  res <- Response$new()
  res$header("Access-Control-Allow-Origin","*")
  res$header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE")
  
  print('good')
  input <- fromJSON(req$POST()$input)
  libraryNames <- fromJSON(req$POST()$libraries)
  print(input$desc)
  print(input$genes)
  print(libraryNames)
  
  ptm <- proc.time()
  res$write('g.transform(param)')
  print(proc.time()-ptm)
  res$finish()   
}

s$add(app=my.app, name='Rubik')
## Open a browser window and display the web app
s$browse('Rubik')

