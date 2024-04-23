#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
#use lib './perl/';
use JSON;
use DBI;

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

#create some vars
my $author = $post->{post}->{author};
my $body = $post->{post}->{body};
my $topic = $post->{post}->{topic};

#some regexp to escape in perl but not necessary atm bc i escaped already in js. leaving here bc it's interesting
#$author =~s/(\W)/\\$1/g;
#$body =~s/(\W)/\\$1/g;

# https://stackoverflow.com/a/2877189
# not using this method but left it in in case you want to look at it
# my $query = "INSERT INTO posts (author, body, topic) VALUES (\"". $author . "\", \"". $body . "\", " . $topic .");";

# connect to db
my $dbfile = '../data/scottblog.db';
my $dbh = DBI->connect("dbi:SQLite:dbname=$dbfile","","") or die "Cannot connect to DB!";
#my $sth = $dbh->prepare( $query );

# using the placehodler method for this query: https://metacpan.org/pod/DBD::SQLite#Placeholders
my $sth = $dbh->prepare("INSERT INTO posts (author, body, topic) VALUES (:author, :body, :topic)");

# execute query
my $rv = $sth->execute($author, $body, $topic) or die $DBI::errstr;

if($rv < 0) {
   print $DBI::errstr;
}

print "Successfully Created Post:\n" . $body . "\nby " . $author . " for topic: " . $topic;

$dbh->disconnect();