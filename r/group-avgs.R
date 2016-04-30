#
# Creates averages by group
#

yuqi_parallel <- read.csv("~/Git/ustimeuse.github.io/data/yuqi_parallel.csv")
yuqi_new = yuqi_parallel

# https://susanejohnston.wordpress.com/2012/10/01/find-and-replace-in-r-part-2-how-to-recode-many-values-simultaneously/
recoderFunc <- function(data, oldvalue, newvalue) {
  # convert any factors to characters
  if (is.factor(data))     data     <- as.character(data)
  if (is.factor(oldvalue)) oldvalue <- as.character(oldvalue)
  if (is.factor(newvalue)) newvalue <- as.character(newvalue)
  # create the return vector
  newvec <- data
  # put recoded values into the correct position in the return vector
  for (i in unique(oldvalue)) newvec[data == i] <- newvalue[oldvalue == i]
  newvec
}
                    
find.replace <- data.frame(
  race.original = c("Black-Asian", "Black-American Indian", "White-Asian", "White-American Indian", "White-Black", "Hawaiian Pacific Islander only", "American Indian, Alaskan Native", "White-Black-American Indian", "White-Black-Hawaiian", "White-Asian-Hawaiian", "White-Hawaiian"),
  race = c("Mixed/Other"))

income.old = c(
    'Less than $5,000',
    '$5,000 to $7,499',
    '$7,500 to $9,999',
    '$10,000 to $12,499',
    '$12,500 to $14,999',
    '$15,000 to $19,999',
    '$20,000 to $24,999',
    '$25,000 to $29,999',
    '$30,000 to $34,999',
    '$35,000 to $39,999',
    '$40,000 to $49,999',
    '$50,000 to $59,999',
    '$60,000 to $74,999',
    '$75,000 to $99,999',
    '$100,000 to $149,999',
    '$150,000 and over')
income.new = c("Below $25k", 
               "Below $25k", 
               "Below $25k", 
               "Below $25k",
               "Below $25k",
               "Below $25k",
               "Below $25k",
               "$25k-$50k",
               "$25k-$50k",
               "$25k-$50k",
               "$25k-$50k",
               "$50k-$75k",
               "$50k-$75k",
               "$75k-$100k",
               "$100k+",
               "$100k+")

find.replace.income = data.frame(
  "income.old" = income.old,
  "income.new" = income.new
)

find.replace.income

race = recoderFunc(yuqi_new$race, find.replace$race.original, find.replace$race)
unique(race)
yuqi_new$race.new <- race



income = recoderFunc(yuqi_new$fam_income, find.replace.income$income.old, find.replace.income$income.new)
unique(income)
yuqi_new$income.new <- income

# mean per group 
# http://stackoverflow.com/questions/21982987/mean-per-group-in-a-data-frame
gender.df=as.data.frame(aggregate(yuqi_new[, 8:12], list(yuqi_new$sex), mean))
employment.df=as.data.frame(aggregate(yuqi_new[, 8:12], list(yuqi_new$fullpart), mean))
income.df=as.data.frame(aggregate(yuqi_new[, 8:12], list(yuqi_new$income.new), mean))
race.df=as.data.frame(aggregate(yuqi_new[, 8:12], list(yuqi_new$race.new), mean))
new.df=rbind(gender.df, employment.df, income.df, race.df)

new.df$type=rep(c("gender","employment","income","race"),c(2,2,length(unique(income)),length(unique(race))))


write.csv(new.df,"~/Git/ustimeuse.github.io/data/group-avgs.csv",row.names=F)
write.csv(yuqi_new,"~/Git/ustimeuse.github.io/data/yuqi_new.csv",row.names=F)
