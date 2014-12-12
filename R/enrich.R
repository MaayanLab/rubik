libraries <- readRDS('data/currentLibraries.rds')

eachEnrich <- function(libraryMat,inputGenes){
  # perform enrichment analysis for each libraryMat and inputGenes
  
  background <- colnames(libraryMat)
  terms <- rownames(libraryMat)
  # exclude genes in input but not in library background   
  effectiveInput <- intersect(background,inputGenes)
  effectiveMat <- libraryMat[,effectiveInput]
  
  termsGeneCount <- rowSums(libraryMat>0)
  # suitable for fuzzy library
  overlappingCount <- round(rowSums(effectiveMat))
  bgGeneCount <- length(background)
  inputGeneCount <- length(effectiveInput)
  
  lapply(1:length(terms),function(i){
    termObj <- list()
    termObj$term <- terms[i]
    
    overlap <- overlappingCount[i]
    termGeneCount <- termsGeneCount[i]
    mat<- matrix(c(overlap,inputGeneCount-overlap,
                   termGeneCount,bgGeneCount-termGeneCount),
                 nrow=2)
    termObj$pval <- fisher.test(mat,alternative="greater")$p.value
    termObj
  })
  
}


enrich <- function(input,chosenLibraries){
  enrichResults <- list()
  for(geneList in input){
    enrichResult <- list()
    enrichResult$tag <- geneList$desc
    genes <- geneList$genes
    enrichResult$data <- 
      lapply(libraries[chosenLibraries],
            eachEnrich,inputGenes=genes)
    enrichResults <- c(enrichResults,list(enrichResult)) 
  }
  enrichResults
}
