-- SQL Server 2022. New chat + shop app, expected 50M messages/year. "Please review before we go live."
CREATE TABLE Users (
  Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,   -- clustered
  FullName NVARCHAR(MAX) NOT NULL,
  Email NVARCHAR(MAX) NOT NULL,
  Phone INT NULL,
  Age TINYINT NULL,
  IsActive BIT NOT NULL,
  Status BIT NOT NULL            -- 0 = pending, 1 = approved (may need "banned" later)
);

CREATE TABLE Orders (
  Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  UserId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
  Total FLOAT NOT NULL,
  CreatedAt DATETIME NOT NULL
);

CREATE TABLE Messages (
  Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  RoomId UNIQUEIDENTIFIER NOT NULL,
  SenderId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),
  Body NVARCHAR(MAX) NOT NULL,
  SentAt DATETIME2 NOT NULL
);
-- Plan: nightly job  DELETE FROM Messages WHERE SentAt < DATEADD(day, -90, SYSUTCDATETIME());
-- Main screen: newest 50 messages of a room, then "load older".
