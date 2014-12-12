argInts <- list()
argInts <- c(argInts, list(matrix(c(2, 3, 6, 4), nrow=2)))
argInts <- c(argInts, list(matrix(c(2, 1, 3, 0), nrow=2)))
argInts <- c(argInts, list(matrix(c(3, 0, 2, 1), nrow=2)))
argInts <- c(argInts, list(matrix(c(1, 2, 0, 3), nrow=2)))
argInts <- c(argInts, list(matrix(c(3, 1, 1, 3), nrow=2)))
argInts <- c(argInts, list(matrix(c(1, 3, 3, 1), nrow=2)))
argInts <- c(argInts, list(matrix(c(0, 1, 1, 0), nrow=2)))
argInts <- c(argInts, list(matrix(c(1, 0, 0, 1), nrow=2)))
argInts <- c(argInts, list(matrix(c(11, 0, 0, 6), nrow=2)))
argInts <- c(argInts, list(matrix(c(10, 1, 1, 5), nrow=2)))
argInts <- c(argInts, list(matrix(c(5, 6, 6, 0), nrow=2)))
argInts <- c(argInts, list(matrix(c(9, 2, 2, 4), nrow=2)))
argInts <- c(argInts, list(matrix(c(6, 5, 5, 1), nrow=2)))
argInts <- c(argInts, list(matrix(c(8, 3, 3, 3), nrow=2)))
argInts <- c(argInts, list(matrix(c(7, 4, 4, 2), nrow=2)))

# the same as Java pal.statistics
for(mat in argInts){
  print(as.vector(mat))
  # use greater
  pval <- fisher.test(mat,alternative="greater")
  print(pval$p.value)
  pval <- fisher.test(mat,alternative="less")
  print(pval$p.value)
}