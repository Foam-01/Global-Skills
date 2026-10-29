A teammate posts this in chat. The user asks: "เขาสรุปถูกไหม เอาไปใช้บน production ได้เลยไหม"

> Fixed the slow dashboard query 🎉
> Before: CPU 202 ms, elapsed 276 ms
> I added `OPTION (RECOMPILE)` and ran it again → CPU 79 ms, elapsed 122 ms (2x faster!)
> STATISTICS IO both runs: Table 'Users'. Scan count 13, logical reads 15,120
> 15,120 reads × 8 KB = 118 MB RAM saved per call 💪
> Also: Scan count 13 means it scanned the whole table 13 times, so next I'll add an index.
> To test properly on prod I'll run DBCC DROPCLEANBUFFERS before each run.
>
> Query:
> SELECT DisplayName, Location FROM Users
> WHERE YEAR(LastAccessDate) = 2018 AND MONTH(LastAccessDate) = 8
> -- existing index: IX_Users_LastAccessDate (LastAccessDate)
