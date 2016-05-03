fname=file.choose()


#
# Creates averages by group
#

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

unique(yuqi_new$fam_income)
                    
find.replace <- data.frame(
  race.original = c("Black-Asian", "Black-American Indian", "White-Asian", "White-American Indian", "White-Black", "Hawaiian Pacific Islander only", "American Indian, Alaskan Native", "White-Black-American Indian"),
  race = c("Mixed/Other"))

income.old = unique(yuqi_new$fam_income)
income.new = c("$100k+", "$25k-$50k", "$100k+", "$50k-$75k","$25k-$50k",
               "Below $25k","$25k-$50k","Below $25k","Below $25k","$50k-$75k",
                "Below $25k","$75k-$100k","Below $25k","Below $25k","Below $25k",
               "$25k-$50k")

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
gender.df=as.data.frame(aggregate(yuqi_new[, 8:13], list(yuqi_new$sex), mean))
employment.df=as.data.frame(aggregate(yuqi_new[, 8:13], list(yuqi_new$fullpart), mean))
income.df=as.data.frame(aggregate(yuqi_new[, 8:13], list(yuqi_new$income.new), mean))
race.df=as.data.frame(aggregate(yuqi_new[, 8:13], list(yuqi_new$race.new), mean))
new.df=rbind(gender.df, employment.df, income.df, race.df)

write.csv(new.df,"group-avgs.csv",row.names=F)
write.csv(yuqi_new,"yuqi_new.csv",row.names=F)
