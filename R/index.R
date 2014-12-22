library(Rook)
library(Matrix)
library(jsonlite)

# prelude, Fisher exact function on input ---------------------------------
setwd('./rubik')
source("enrich.R")


# format input ------------------------------------------------------------

format.input<-function(input){
  lapply(1:length(input$tag),function(i){
    geneList <- list()
    geneList$tag <- input$tag[i]
    geneList$genes <- input$genes[[i]]
    geneList
  })
}


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
  input <- format.input(input)
  
  print('new request')
  print(libraryNames)
  
  
  ptm <- proc.time()
  res$write(toJSON(enrich(input,libraryNames),digits=6,auto_unbox=TRUE))
  print(proc.time()-ptm)
  res$finish()
}

s$add(app=my.app, name='Rubik')
## Open a browser window and display the web app
s$browse('Rubik')

