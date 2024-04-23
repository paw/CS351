# Scottblog midterm problem redux.
**Utilizes:** Javascript, HTML/CSS, Perl/CGI, JSON, & SQLite.

code has some inline comments. primarily uses 775/777 perms.

you can ignore the unnamed lib with a path to a perl file. i used local::lib to create a perl install local to me. this lets me install modules without affecting anybody else and without needing root access.

This is primarily what I followed to set it up: https://stackoverflow.com/a/2980321

## SQLite3 download: https://www.sqlite.org/download.html
- install on your computer to create SQLite3 dbs via the command line
- i have included a new empty db in the data folder jic

## Modify SQLite DB structures/data and test queries offline:
- https://sqlitestudio.pl/

## Perl Modules ( installed via https://metacpan.org/ ):
- CGI of course :p
- local::lib: https://metacpan.org/pod/local::lib
- JSON: https://metacpan.org/pod/JSON
- DBI DBD::SQLite: https://metacpan.org/pod/DBD::SQLite