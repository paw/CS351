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

# FILE info
my $filename = '../../data/store.json';

# create a CGI object (query) for use
my $q = CGI->new;
my $postraw = $q->param('POSTDATA') or die "PERMISSION DENIED.";

# decode JSON from POST
my $json = JSON->new->allow_nonref;
my $order = $json->decode( $postraw );

# open products FILE
open(my $productsfile, '+<', $filename) or die "OPENING $filename: $!\n";
my $filetext = do { local($/); <$productsfile> };

# decode JSON from FILE
my $filejson = JSON->new->allow_nonref;
my $store = $filejson->decode( $filetext );

my $returnMessage = "NOTHING. UGH!";

# looking at all hashes found in order JSON
for my $i (0 .. @{$order->{ORDER}}-1) {
   # looking at all products in order JSON
   for my $k (0 .. @{$store->{products}}-1) {
      # update quantity if 
      if (@{$store->{products}}[$k]->{id} eq @{$order->{ORDER}}[$i]->{id}) {
         $returnMessage = "hi it's the cgi if you're seeing this we all good.";
         @{$store->{products}}[$k]->{quantity} = @{$store->{products}}[$k]->{quantity} - @{$order->{ORDER}}[$i]->{quantity};
      }
   }
}

my $order_id = gen_uuid();

#create key called info, add timestamp to it
$order->{INFO}->{timestamp} = localtime(time);
$order->{INFO}->{id} = $order_id;

# encode both order and updated products hashes
my $orderFinalized = $json->pretty->encode( $order );
my $updatedProducts = $filejson->pretty->encode( $store );

# write updated products to file
seek($productsfile, 0, 0);
print $productsfile $updatedProducts;
truncate($productsfile, tell($productsfile)); 
close($productsfile); #close products file since we're done

#create a new file for the order named with the timestamp
open my $orderfile, '>', '../../data/orders/order_' . $order_id . ".json" or die "Can't create file: $!\n";
   print $orderfile $orderFinalized;
close $orderfile; # close after printing

#print $returnMessage;
print $order_id;
# all done!

sub gen_uuid {
   # https://www.perturb.org/display/1356_Perl_Generate_random_UUID.html
	my $uuid = '';
	for ( 1 .. 4 ) {
		$uuid .= pack 'I', int(rand(2 ** 32));
	}

	substr $uuid, 6, 1, chr( ord( substr( $uuid, 6, 1 ) ) & 0x0f | 0x40 );

	return join '-',
		map { unpack 'H*', $_ }
		map { substr $uuid, 0, $_, '' }
		( 4, 2, 2, 2, 6 );
}