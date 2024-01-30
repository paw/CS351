begin perl file:
#!/usr/bin/perl -T

use strict;
use warnings;
use CGI;

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: text/html\n\n";
}

my $q = CGI->new;

______

string = declared with $variable
- to get param: my $variable = $q->param('parametername') || default;

array of strings = declared with @variable
- to get params: @arrayname = $q->multi_param('parametername');

hash = declared with
- to get 


______

## links

- [POST requests](https://stackoverflow.com/questions/11264470/how-to-post-content-with-an-http-request-perl)
- [HTML TEMPLATES](https://metacpan.org/pod/HTML::Template)
