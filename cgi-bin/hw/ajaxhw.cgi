#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib '../perl/';
#use local::lib;
use JSON;
use Data::Dumper;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: application/json; charset=UTF-8\n\n";

}

# create a CGI object (query) for use
my $q = CGI->new;
my $raw = $q->param('POSTDATA');

my $json = JSON->new->allow_nonref;
my $data = $json->decode( $raw );

for my $i (0 .. @{$data->{POST}}-1) {
   print ("<b style=\"color:" . @{$data->{POST}}[$i]->{color} . "\">I like " . @{$data->{POST}}[$i]->{name} . " too!</b><br>");
}
