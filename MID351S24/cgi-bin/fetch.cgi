#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib './perl/';
use SQLite::DB;
use Data::Dumper;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: application/json; charset=UTF-8\n\n";
}

#SELECT * FROM posts WHERE topic == '2'  ORDER BY rowid DESC LIMIT 1;


# create a CGI object (query) for use
my $q = CGI->new;
my $postraw = $q->param('POSTDATA') or die "PERMISSION DENIED.";

my @topics = split("\n",$postraw);

 
my $db = SQLite::DB->new('../data/scottblog.db');
 
$db->connect;
 
$db->select("select * from table where topic == '2' order by rowid desc limit 1",{}) || print $db->get_error."\n";
 
my $resultset = $db->get_dblist("select * from table","display_field","keyfield");
 
if (!ref $resultset) {
  print $db->get_error."\n"
} else {
  for (@$resultset) {
    print $resultset->[$_]->{id}." - ".$resultset->[$_]->{value}."\n";
  }
}
 
$db->disconnect;
