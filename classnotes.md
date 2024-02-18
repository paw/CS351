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

hash = declared with %
- to get 

- work with store5 (2/1)
- command to check what was recently edited in the week files: ls -lrt 

______

## links

- [POST requests](https://stackoverflow.com/questions/11264470/how-to-post-content-with-an-http-request-perl)
- [HTML TEMPLATES](https://metacpan.org/pod/HTML::Template)
- [CGI & SQLite](https://github.com/patrickmoffitt/ble_sensor_cgi)
- [AJAX/Fetch](https://medium.com/@reemshakes/is-ajax-getting-replaced-by-fetch-api-55207234793f)
- [XML post req](https://code.tutsplus.com/create-a-javascript-ajax-post-request-with-and-without-jquery--cms-39195a)
- https://www.perlmonks.org/?node_id=651544
- [JSON](https://metacpan.org/pod/JSON), [Data::Dumper](https://metacpan.org/pod/Data::Dumper), [Data::Diver](https://metacpan.org/pod/Data::Diver)