library(dplyr)
library(jsonlite)
bitcoin <- read.csv("data/coindata.csv", header = TRUE)

names(bitcoin) <- c("Date", "ClosePrice")

bitcoin <-
  bitcoin %>% 
  filter(!is.na(ClosePrice))

bitcoin$Date <- substr(bitcoin$Date, 1, 10)

writeLines(paste0("var data = ", toJSON(bitcoin)), "data/coindata.js")
