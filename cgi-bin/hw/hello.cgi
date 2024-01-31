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
my $template = HTML::Template->new(filename => 'hello.tmpl');

my $title = "Hello World!"; # page title

my $q = CGI->new;
my $name = $q->param('name') || "My Friend";

# setting the template variables' values
$template->param(TITLE => $title);
$template->param(
    CARDS => [{title => 'HELLO WORLD!', body => 'Hello ' . ${name} . '!'}, {title => 'Welcome to my world!', body => ':)'}, {title => 'Change the parameter in the url...', body => '...and my page will greet you personally!'}, {title => 'Template LOOPS', body => 'are very neat! Look at all these cards!'}]
);

# print it out on the page
print $template->output;