#!/usr/bin/perl

  use strict;
  use warnings;
  use lib '/var/www/spetkas.com/public_html/SUNY/CS351/code/PMS2/Class-Accessor-0.34/blib/lib';
  use base 'Class::Accessor::Fast';
  use Class::Accessor::Fast;
  use Class::Accessor;
  use lib '/var/www/spetkas.com/public_html/SUNY/CS351/code/PMS/CGI-Ajax-0.697/blib/lib';
  use CGI::Ajax;
  use lib '/var/www/spetkas.com/public_html/SUNY/CS351/code/PMS/CGI-4.35/lib';
  use CGI;

BEGIN{
   open (STDERR, ">&STDOUT");
   select(STDERR); $| = 1;
   select(STDOUT); $| = 1;
  print "Content-type: text/html\n\n";
}


   open (MYOUT, ">>MYOUT");
   print MYOUT $ENV{'QUERY_STRING'};
   print MYOUT "\n";



    # create a CGI object (query) for use
    my $q = CGI->new;
    my $myFunc   = $q->param('myfunc');
    my @PRODS;
    print MYOUT "myFunc=$myFunc";
    # get the category of merchandise

    # ***************************
    #          Category
    # ***************************
    if ($myFunc eq "category") {
    	# get the list of items for the category
    	my $thelist, my $line, my $cat;
        my $category = $q->param('category');
        #my @values  = $q->param('testcase');
        print MYOUT "category is: $category";

   	open(MYPRODS, "<products3") || die "Can't open products: $!\n";
   	#@newarray = <MYPRODS>;
   	#print "NEWARRAY @newarray";
	foreach $line (<MYPRODS>) {
    		chomp $line;
		($cat, $thelist) = split(/:/,$line);
    		if($cat eq $category){
		 	print "$thelist";
   	 		close (MYPRODS);
		 	exit;
		}
	}
        print "Category $category not found";
    }
    # ***************************
    #          Items
    # ***************************
    if ($myFunc eq "items") {
	# my @items  = $q->multi_param('items');
        # print MYOUT "MY ITEMS: @items";
	# print @items;
	my @items  = $q->multi_param('items');
        print MYOUT "MY ITEMS: @items";
	#MY ITEMS: beverage:pepsi:444;beverage:coke:333
	#print $items;
	#my @itemsOrdered = split(/;/,$items);
	my @itemsOrdered = @items;
	my $cnt=1;
 	my $thisItem;
        print @items;
	#foreach $thisItem (@itemsOrdered) {
		#print "invoice$cnt: $thisItem <br>";
		#$cnt++;
	#}
	#open(PRODS, "<cgi-bin/products3") || die "Can't open products3: $!\n";
	#@PRODS = <PRODS>;
	#print "PRODS= @PRODS";
      
    };
    sub getitem
    {
    };
    sub setitem
    {
    };

