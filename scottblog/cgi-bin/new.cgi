#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib './perl/';
#use local::lib;
use JSON;
use DBI;
use Sanitize;
use Data::Dumper;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: application/json; charset=UTF-8\n\n";
}

# will only query db if a post request is involved
my $q = CGI->new;
my $postraw = $q->param('POSTDATA') or die "PERMISSION DENIED.";

# decode JSON from POST
my $json = JSON->new->allow_nonref;
my $post = $json->decode( $postraw );

#sanitize stuff
my $author = sanitize($post->{post}->{author}, html => 1);
my $body = sanitize($post->{post}->{body}, html => 1);
#$author =~s/(\W)/\\$1/g; <- regexp to escape in perl but not necessary atm
#$body =~s/(\W)/\\$1/g;
my $topic = sanitize($post->{post}->{topic}, number => 1);

# https://stackoverflow.com/a/2877189
# not using this method
# my $query = "INSERT INTO posts (author, body, topic) VALUES (\"". $author . "\", \"". $body . "\", " . $topic .");";


#print "\n\nQUERY:\n\n" . $query . "\n\n";

my $dbfile = '../data/scottblog.db';
my $dbh = DBI->connect("dbi:SQLite:dbname=$dbfile","","") or die "Cannot connect to DB!";
#my $sth = $dbh->prepare( $query );

my $sth = $dbh->prepare("INSERT INTO posts (author, body, topic) VALUES (:author, :body, :topic)");

# Binary_data will be stored as is.
my $rv = $sth->execute($author, $body, $topic) or die $DBI::errstr;

if($rv < 0) {
   print $DBI::errstr;
}

print "Successfully Created Post:\n" . $body . "\nby " . $author . " for topic: " . $topic;

$dbh->disconnect();