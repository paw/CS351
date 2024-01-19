#!/usr/bin/perl -T

BEGIN {
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
   print "Content-type: text/html\n\n";
}
print "<h1>SCOTT made this</h1>" ;
print ">HELLO&nbsp;&nbsp;&nbsp;&nbsp;<b> <&nbsp;&nbsp;&nbsp;WORLD&GT;</h1>" ;
print ">HELLO&nbsp;&nbsp;&nbsp;&nbsp;<b> \<WORLD\></h1>" ;
print "<\WORLD\></h1>" ;
print "<div style=\"text-align: right;\">hi :)</div>";
