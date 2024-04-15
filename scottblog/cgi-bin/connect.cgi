#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;
use lib '../../cgi-bin/perl/'; #my local perl install
#use Sanitize;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: text/html; charset=UTF-8\n\n";
}

# FILE info
my $filename = '../data/log.txt';

# create a CGI object (query) for use
my $q = CGI->new;
my $postraw = $q->param('POSTDATA') or die "PERMISSION DENIED.";
#my $sanitized = sanitize($postraw, html => 1);

# open products FILE & store our stuff
open(my $logfile, '>>', $filename) or die "OPENING $filename: $!\n";
print $logfile $postraw . " @ " . localtime(time) . "\n";
close $logfile;

#print $returnMessage;
print "successfully logged in";
# all done!