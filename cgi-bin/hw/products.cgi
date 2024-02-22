#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib '../perl/';
#use local::lib;
use JSON;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: application/json; charset=UTF-8\n\n";
}

# create a CGI object (query) for use
my $q = CGI->new;
my $postraw = $q->param('POSTDATA') or die "PERMISSION DENIED.";

#open order file
open my $storefile, '<', '../../data/store.json' or die "Store products not found: $!\n";
my $stock = do { local($/); <$storefile> };
close $storefile;

print $stock;