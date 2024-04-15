#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib '../../cgi-bin/perl/';
use JSON;
use DBI;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   #print "Content-type: text/html; charset=UTF-8\n\n";
   print "Content-type: application/json; charset=UTF-8\n\n";
}

# will only query db if a post request is involved
my $q = CGI->new;
my $postraw = $q->param('POSTDATA') or die "PERMISSION DENIED.";

# https://stackoverflow.com/a/2877189 <- char thing
# query is for the the most recent post in each topic category
my $query = qq{
SELECT
pt1.rowid,
topics.title,
pt1.author,
pt1.body,
STRFTIME('%m/%d/%Y @ %H:%M', pt1.created) AS created_formatted 
FROM posts pt1 LEFT JOIN posts pt2
 ON (pt1.topic = pt2.topic AND pt1.rowid < pt2.rowid) INNER JOIN topics ON pt1.topic=topics.id
WHERE pt2.rowid IS NULL
order by pt1.topic asc;
};

#sqlite db file.
# FYI the directory containing the db has to be writeable or it'll open the db in read-only mode. the module's page has a more info
my $dbfile = '../data/scottblog.db';
my $dbh = DBI->connect("dbi:SQLite:dbname=$dbfile","","") or die "db fail";

#prepare & execute command
my $sth = $dbh->prepare( $query );
my $rv = $sth->execute() or die $DBI::errstr;

if($rv < 0) {
   print $DBI::errstr;
}

# decode JSON from POST
my $json = JSON->new->allow_nonref;
my $data = "{ \"posts\" : [] }"; #create our basic JSON structure in string
my $hash = $json->decode( $data );  #converts to a hash that the JSON module can use

#here we store unnamed objects containing our post data in the posts array
my $i = 0;
while(my @row = $sth->fetchrow_array()) {
      my $body = $row[3];
      my $author = $row[2];
      $hash->{posts}[$i]->{postid} = $row[0];
      $hash->{posts}[$i]->{author} = $author;
      $hash->{posts}[$i]->{topic} = $row[1];
      $hash->{posts}[$i]->{body} = $body;
      $hash->{posts}[$i]->{timestamp} = $row[4];
      $i++;
}

#we send back a pretty formatted json string that we can convert into a json object in our javascript
my $json_text = JSON->new->pretty->encode($hash) or die "json problems";

print $json_text; #returning our json

#don't forget to disconnect! :)
$dbh->disconnect();
