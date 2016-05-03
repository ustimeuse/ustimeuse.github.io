fname=file.choose()
data=read.csv(fname)
head(data)

names(data)

#### DATA CLEANING ####
summary(data)
names(data)
nrow(data) #11592


# Remove people who have NA values for school/college
df=data
# INSIGHTS: There are only 27 students enrolled in college or high school part time/full-time out of 1615 people
df=df[df$schlcoll=="College/university full time College/university part time" | df$schlcoll=="Not enrolled" | df$schlcoll=="High school full time" | df$schlcoll=="High school part time",]
nrow(df) #5418

# Remove people with unknown values (NIU)
df=df[df$fullpart=="Full time" | df$fullpart=="Part time",]
nrow(df) #4085

# Checkpoint
summary(df)

# Dat represents cleaned data
dat=df
df=dat

# Grab needed and relevant variables
head(data)
df=data.frame(df$state, df$famincome, df$race, df$age, df$sex, df$empstat, df$fullpart, df$act_work, df$act_travel, df$act_hhact, df$act_pcare, df$act_social, df$act_sports)
names(df)
nrow(df) #4085

#### EXPLORATORY #####
summary(df)

hist(df$df.act_educ) # extremely high concentration of 0's: 98.6%
sum(df$df.act_educ==0)/length(df$df.act_educ)

# Combine and recalculate act_leisure:
df$df.act_leisure=df$df.act_social + df$df.act_sports

hist(df$df.act_pcare) # pretty normal, centered around 500-600 minutes
hist(df$df.act_work) # abnormal concentration of 0. If we remove the 0's, the rest of the data would look fairly normal centered around 500
hist(df$df.act_leisure) # right skewed but is reasonably okay, with some extreme values of very high act_leisure

# ANALYSIS: Suspect that most of the sample units are from retired and older people who stay at home

names(df)
df$df.act_sports <- NULL
df$df.act_social <- NULL

# EXTRACT DATA for Yuqi's graph
write.csv(df, file="yuqi_parallel.csv")

female=df[df$df.sex=="Female",]
male=df[df$df.sex=="Male",]
head(female)

nrow(female) #2020
nrow(male) #2065

str(df$df.race)

head(female)
mean(female$df.act_travel) #76.52624
mean(female$df.act_hhact) #114.5248

mean(male$df.act_travel) #82.34092
mean(male$df.act_hhact) #80.80823

full=df[df$df.fullpart=="Full time",]
part=df[df$df.fullpart=="Part time",]

mean(full$df.act_travel) #80.588
mean(full$df.act_hhact) #95.034

mean(part$df.act_travel) #74.15708
mean(part$df.act_hhact) #109.0519

emp=unique(as.character(df$df.fullpart))
emp

nrow(full)
nrow(part)

races=(as.character(unique(df$df.race)))
races

dat=df
df=dat
head(dat)

df$race.ind[df$df.race=="Black only" | df$df.race=="Asian only" | df$df.race=="White only"] <- "1"
mixed=df[df$race.ind!="1",]
nrow(mixed)

black=df[df$df.race=="Black only",]
nrow(black)
white=df[df$df.race=="White only",]
nrow(white)
asian=df[df$df.race=="Asian only",]
nrow(asian)

mean(black$df.act_travel) # 74.91183
mean(black$df.act_hhact) #73.42366
mean(white$df.act_travel) #80.12028
mean(white$df.act_hhact) #100.12
mean(asian$df.act_travel) #81.13778
mean(asian$df.act_hhact) #100.12
mean(mixed$df.act_travel) #79.46561
mean(mixed$df.act_hhact) #97.48078

income=(as.character(unique(df$df.famincome)))
income

df$inc.ind[df$df.famincome=="Less than $5,000"| df$df.famincome=="$5,000 to $7,499"| df$df.famincome=="$7,500 to $9,999"| df$df.famincome=="$12,500 to $14,999"| df$df.famincome=="$20,000 to $24,999" | df$df.famincome=="$15,000 to $19,999" | df$df.famincome=="$10,000 to $12,499"] <- "0"
df$inc.ind[df$df.famincome=="$25,000 to $29,999"| df$df.famincome=="$30,000 to $34,999"| df$df.famincome=="$40,000 to $49,999" | df$df.famincome=="$35,000 to $39,999"] <- "1"
df$inc.ind[df$df.famincome=="$50,000 to $59,999"| df$df.famincome=="$60,000 to $74,999"] <- "2"
df$inc.ind[df$df.famincome=="$75,000 to $99,999"] <- "3"
df$inc.ind[df$df.famincome=="$100,000 to $149,999"| df$df.famincome=="$150,000 and over"] <- "4"

first=df[df$inc.ind=="0",] #580
second=df[df$inc.ind=="1",] #1558
third=df[df$inc.ind=="2",] #1410
fourth=df[df$inc.ind=="3",] #1208
fifth=df[df$inc.ind=="4",] #1649

nrow(first)
nrow(second)
nrow(third)
nrow(fourth)
nrow(fifth)


mean(first$df.act_travel) # 67.82586
mean(first$df.act_hhact) #95.39655
mean(second$df.act_travel) #72.62168
mean(second$df.act_hhact) #95.766
mean(third$df.act_travel) # 80.40241
mean(third$df.act_hhact) #92.22048
mean(fourth$df.act_travel) #85.81847
mean(fourth$df.act_hhact) #105.121
mean(fifth$df.act_travel) #87.58279
mean(fifth$df.act_hhact) #99.77643
