#!/usr/bin/perl

  use strict;
  use warnings;
  use lib '/home/f/csci/scott/www/cgi-bin/PMS/Class-Accessor-0.34/blib/lib';
  use base 'Class::Accessor::Fast';
  use Class::Accessor::Fast;
  use Class::Accessor;
  use lib '/home/f/csci/scott/www/cgi-bin/PMS/CGI-Ajax-0.697/blib/lib';
  use CGI::Ajax;
  use lib '/home/f/csci/scott/www/cgi-bin/PMS/CGI-4.35/lib';
  use CGI;

  my %values;
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
  #my $q = new CGI;
  my $q = CGI->new ;

  print "Content-type: text/html\n\n";
  #print $q->header('text/html'),
  #print "hello\n\n";
  #my @values  = $q->multi_param('QUERY_STRING');
   #$q->CGI::ReadParse(*values);
   my $myFunc = $q->CGI::param('myfunc');
   #print $values{'myFunc'};
   print "<B>FUNC:<\B><br>";
   print $myFunc;
   print "<br><B>after FUNC:<\B><br>";

   print "<br>AFTER MYFUNC<br>";
   print "<br>VALUES<br>";
   print $ENV{'QUERY_STRING'};
   print "<br>AFTER VALUES<br>";
   my @names = $q->CGI::param;
   print @names;
   print "<br>AFTER KEYWORDS<br>";
   my @keywords = $q->CGI::keywords;
   print @keywords;
   print "<br>AFTER KEYWORDS<br>";
   print $myFunc;
   print "<br>AFTER FUNC<br>";
   # &CGI::ReadParse(*values);

  BEGIN {
  #my $q = CGI::new() ;
  #my @values  = $q->multi_param('form_field');
  #print "Content-type: text/html\n\n";
   #open (STDERR, ">&STDOUT");
   #select(STDERR); $| = 1;
   #select(STDOUT); $| = 1;
   #my $buffer = $ENV{'QUERY_STRING'};
   #print "QS $buffer \n";
   #$q->CGI::ReadParse(*values);
   #my @values  = $q->multi_param('form_field');
   #print $q->header('text/html'),
   #print $CGI::q->header('application/json'),
   #$q->CGI::start_html(-title=>'ATAC');
   #&CGI::ReadParse(*values);
   #print &PrintHeader, &PrintVariables(%values);
  #exit;
  }

