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
   print "Content-type: text/html\n\n";
}

my $filename = './store.json';
my $filetext;

open(my $f, '<', $filename) or die "OPENING $filename: $!\n";
$filetext = do { local($/); <$f> };
close($f);

=begin comment
#my $utf8_encoded_json_text = encode_json $perl_hash_or_arrayref;
#my $perl_hash_or_arrayref  = decode_json $utf8_encoded_json_text;
 
#OO-interface
=end comment
=cut

my $json = JSON->new->allow_nonref;
 
#my $json_text   = $json->encode( $perl_scalar );
my $data = $json->decode( $filetext );
 
#my $prout = $json->pretty->encode( $data ); # pretty-printing

#print Dumper(\$data);

print("<div style=\"word-wrap: break-word;\">");

#https://stackoverflow.com/a/25954102
my @products = @{$data->{products}};
print ("<pre>",Dumper(@products),"</pre>");
#print ("<pre>PRODUCTS[0]<br>",Dumper(@{$data->{products}}),"</pre>");
print("products is ", @products, "<br>");
print("products[0] is ", @{$data->{products}}[0], "<br>");
print("products[0] id is ", @{$data->{products}}[0]->{id}, "<br>");
my $firstprod = $data->{products}->[0];
print ${$data}{products}[0], "<br><br>";
print $data->{products}->[0]->{id}, "<br><br>";
print "key: $_<br>" for keys %{$firstprod};

print("<hr>");

#foreach (@Array) { $_ }

for my $i (0 .. @{$data->{products}}-1) {
   for(keys %{@{$data->{products}}[$i]}){
      print("key: $_ / val: @{$data->{products}}[$i]->{$_}<br>");
   }
   print("<br><br>");
}

print("<hr>");

for my $i (0 .. @{$data->{products}}-1) {
   print("COUNT ",$i,":<br><br>");
   if (@{$data->{products}}[$i]->{category} eq "Food") {
      for(keys %{@{$data->{products}}[$i]}){
         print("key: $_ / val: @{$data->{products}}[$i]->{$_}<br>");
      }
   }
   print("<br><br>");
}

for(keys %{$firstprod}){
	print("key: $_ / val: $firstprod->{$_}<br>");
}

print "</div>";