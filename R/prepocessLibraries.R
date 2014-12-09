library(rmongodb)
library(pracma)
library(Matrix)
mongo <- mongo.create(host="localhost")
# mongo
dbns = "gmts.genes"

libraryNames = c('ChEA2','KEGG_pathways','WikiPathways_pathways','GeneOntology_BP',
'GeneOntology_MF','MGI_MP_top4','KEA','L1000_Kinase_Perturbations',
'KinasePerturbationsGEO_ChDir_37kinases_94perturbations')

libraries = list()

libraryName <- libraryNames[1]

for(libraryName in libraryNames){
	query = mongo.bson.from.JSON(sprintf('{"gmt":"%s"}',libraryName))
	projection = mongo.bson.from.JSON('{"term":1,"items":1,"membership":1}');
	cursor <- mongo.find(mongo,ns=dbns,query=query,fields=projection)

	background <- c()
	docs <- list()
	while (mongo.cursor.next(cursor)) {
  		# iterate and grab the next record
  		doc <- mongo.bson.to.list(mongo.cursor.value(cursor))
  		doc$items <- unlist(lapply(doc$items,toupper))
  		background <- union(background,doc$items)
  		docs <- c(docs,list(doc))
  	}

  	background <- sort(background)
  	hasMembership <- !is.null(docs[[1]]$membership)

  	mat <- NULL
  	for(doc in docs){
  		if(hasMembership){
  			# to be tested....
  			row <- matrix(0,ncol=length(background))
  			row[,doc$items] <- doc$membership
  		}else{
  			row <- matrix(background %in% doc$items * 1,nrow=1)
  		}
  		dimnames(row) <- list(c(doc$term),background)
  		mat <- rbind(mat,row)
  	}
    
  #  sparse matrix  
    mat <- Matrix(mat)
  	libraries <- c(libraries,list(libraryName=mat))
}

saveRDS(libraries,"data/currentLibraries.rds")
