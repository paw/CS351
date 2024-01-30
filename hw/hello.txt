#!/usr/bin/perl -T

use strict;
use warnings;
use HTML::Template;
use CGI;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: text/html\n\n";
}

# using a very basic html template
my $template = HTML::Template->new(filename => 'basic.tmpl');

my $title = "Hello World!"; # page title
my $output = ""; # output to the template

my $q = CGI->new;
my $name = $q->param('name') || "My Friend";

# adding stuff to print out to our output var
$output .= "<h1>HELLO WORLD!</h1>" ;
$output .= "<h2>HELLO ${name}!</h2>" ;
$output .= "<h3>Welcome to the world!</h3>" ;
$output .= "<div style=\"text-align: right;\">hi :)</div>";

# setting the template variables' values
$template->param(TITLE => $title);
$template->param(BODY => $output);

# print it out on the page
print $template->output;