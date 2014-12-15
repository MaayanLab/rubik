source("enrich.R")

# helpers
sortRes <- function(res){
	pvals <- sapply(res,"[[","pval")
	terms <- sapply(res,"[[","term")
	sortIdx <- order(pvals)
	sortedRes <- res[sortIdx]
}

splitGenesByNewline <- function(pathx){
	newLinePathx <- paste(pathx,'.n.txt');
		exampleInput <- readLines(pathx)
		exampleInput <- unlist(strsplit(exampleInput,"\t"))
		fconn <- file(newLinePathx)
		writeLines(exampleInput,fconn)
		close(fconn)
}

wirteRes2table <- function(res,pathx) {
	pvals <- sapply(res,"[[","pval")
	terms <- sapply(res,"[[","term")
	table <- data.frame(terms=terms,pvals=pvals)
	tablePathx <- paste(pathx,'.table.txt')
	write.table(table,file=tablePathx,quote=FALSE,sep="\t")
}

almost.equal <- function(a,b,tol){
	if(a>b) (a-b)<=tol
	else (b-a)<=tol
}


# test eachEnrich
eachEnrichTest <- function(exampleInput,libraryName,pathx){
	ptm <- proc.time()
	res <- eachEnrich(libraries[[libraryName]],exampleInput)
	print(proc.time()-ptm)
	
	sortedRes <- sortRes(res)
	wirteRes2table(sortedRes,pathx)

	sortedRes
}


pathx <- "test/ELK1-19687146-Hela cells-human.txt"
splitGenesByNewline(pathx)
exampleInput <- readLines(pathx)
exampleInputChEA2 <- unlist(strsplit(exampleInput,"\t"))
sortedRes <- eachEnrichTest(exampleInputChEA2,"ChEA2",pathx)
stopifnot(sortedRes[[1]]$term=="ELK1-19687146-Hela cells-human")

pathx <- "test/HSA04540_GAP_JUNCTION.txt"
splitGenesByNewline(pathx)
exampleInput <- readLines(pathx)
exampleInputKEGG <- unlist(strsplit(exampleInput,"\t"))
sortedRes <- eachEnrichTest(exampleInputKEGG,"KEGG_pathways",pathx)
stopifnot(sortedRes[[1]]$term=="HSA04540_GAP_JUNCTION")
stopifnot(almost.equal(sortedRes[[1]]$pval, 3.16E-111, 10^(-20)))
stopifnot(sortedRes[[2]]$term==
	"HSA04912_GNRH_SIGNALING_PATHWAY")
stopifnot(almost.equal(sortedRes[[2]]$pval, 5.248E-29, 10^(-20)))


# test enrich
input <- list()

geneList <- list()
geneList$genes <- exampleInputChEA2
geneList$tag <- "ELK1-19687146-Hela cells-human"
input <- c(input,list(geneList))

geneList <- list()
geneList$genes <- exampleInputKEGG
geneList$tag <- "HSA04540_GAP_JUNCTION"
input <- c(input,list(geneList))

ptm <- proc.time()
enrichRes <- enrich(input,c("ChEA2","KEGG_pathways"))
print(proc.time()-ptm)

stopifnot(sortRes(enrichRes[[1]]$data$ChEA2)[[1]]$term==
	"ELK1-19687146-Hela cells-human")
stopifnot(enrichRes[[1]]$tag==
	"ELK1-19687146-Hela cells-human")

stopifnot(enrichRes[[2]]$tag==
	"HSA04540_GAP_JUNCTION")
stopifnot(sortRes(enrichRes[[2]]$data$KEGG)[[1]]$term==
	"HSA04540_GAP_JUNCTION")
