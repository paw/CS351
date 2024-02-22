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
open my $orderfile, '<', '../../data/orders/order_' . $postraw . ".json" or die "Order not found: $!\n";
my $orderjson = do { local($/); <$orderfile> };
close $orderfile;

print $orderjson;