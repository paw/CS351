#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib '../../cgi-bin/perl/';
#use local::lib;
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

# https://stackoverflow.com/a/2877189
my $query = qq{
SELECT ID, title from topics;
};

my $dbfile = '../data/scottblog.db';
my $dbh = DBI->connect("dbi:SQLite:dbname=$dbfile","","") or die "db fail";

my $sth = $dbh->prepare( $query );
my $rv = $sth->execute() or die $DBI::errstr;

if($rv < 0) {
   print $DBI::errstr;
}

my $decode = "{ \"topics\" : [";

while(my @row = $sth->fetchrow_array()) {
      $decode .= "\n{\n\t\"id\" : \"" . $row[0] . "\",\n\t";
      $decode .= "\"title\" : \"" . $row[1] . "\"\n\t";
      $decode .= "},";
}
$decode = substr $decode, 0, -1;
$decode .= "\n] }";

print $decode;

$dbh->disconnect();