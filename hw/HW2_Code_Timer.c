#include <stdio.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>
#include <stdbool.h>

void clear_input() {
    //clear out input, used when invalid input is entered
    while ( getchar() != '\n' );
};

void start_and_end_timer(struct timeval *start, struct timeval *end, int seconds_to_sleep, bool print_messages) {
    if (print_messages) {
        printf("\nSLEEPING FOR %ds!",seconds_to_sleep);
    };
    //start timer
    gettimeofday(start, NULL);

    //sleep for however long we want
    for (int i = seconds_to_sleep; i > 0; i--) {
        sleep(1);
        if (print_messages) { printf("\n%d",i); };
    }

    //end timer
    gettimeofday(end, NULL);

    if(print_messages) {
        printf("\nDone! Let's see how long it was between these times.\n");
    };
    
};

void print_time(struct timeval *start, struct timeval *end) {
    long seconds = (end->tv_sec - start->tv_sec); //calculations for seconds
    long totalelapsed = ((seconds * 1000000) + end->tv_usec) - (start->tv_usec); //calculations for total elapsed

    long micros = totalelapsed % 1000000; //get seconds
    seconds = totalelapsed / 1000000; //get microseconds

    // have to recalc microseconds if ending microsecond val is bigger than starting microsecond val
    if (start->tv_usec > end->tv_usec) {
        long calc_secs = 1;
        if (seconds > 0 && seconds - 1 > 0) {
            calc_secs = seconds-1;
        };
        micros = ((calc_secs * 1000000) + end->tv_usec) - (start->tv_usec); //calculations for microseconds
        micros = micros % 1000000;
    };
    printf("Time elapsed is %lds and %ldμs\n", seconds, micros);
};

int boundary_tester() {
    // function with a couple of test cases
    struct timeval start;
    struct timeval end;
    start_and_end_timer(&start,&end,1,false);
    start.tv_sec = 3;
    start.tv_usec = 999999;
    end.tv_sec = 1085;
    end.tv_usec = 1;
    
    printf("\nTEST CASE #1:\n\tSTART: %ds %dμs\n\tEND: %ds %dμs\n",start.tv_sec,start.tv_usec,end.tv_sec,end.tv_usec);
    print_time(&start, &end);

    end.tv_sec = 4;

    printf("\nTEST CASE #2:\n\tSTART: %ds %dμs\n\tEND: %ds %dμs\n",start.tv_sec,start.tv_usec,end.tv_sec,end.tv_usec);
    print_time(&start, &end);

    start.tv_usec = 1;
    end.tv_usec = 999999;

    printf("\nTEST CASE #3:\n\tSTART: %ds %dμs\n\tEND: %ds %dμs\n",start.tv_sec,start.tv_usec,end.tv_sec,end.tv_usec);
    print_time(&start, &end);

    end.tv_sec = 3;

    printf("\nTEST CASE #4:\n\tSTART: %ds %dμs\n\tEND: %ds %dμs\n",start.tv_sec,start.tv_usec,end.tv_sec,end.tv_usec);
    print_time(&start, &end);

    // last test case is for the XX:59 -> XX:01 scenario
    // must manually build broken time

    struct tm hour_one;
    struct tm hour_two;
    
    hour_one.tm_hour = 4;
    hour_two.tm_hour = 5;
    hour_one.tm_min = 59;
    hour_two.tm_min = 0;
    hour_one.tm_sec = 0;
    hour_two.tm_sec = 0;

    // same day, jan 1 2025. must manually specify the following vals or mktime will not always output the same result.
    hour_one.tm_mday = 1;
    hour_two.tm_mday = 1;
    hour_one.tm_mon = 0;
    hour_two.tm_mon = 0;
    hour_one.tm_year = 2025 - 1900;
    hour_two.tm_year = 2025 - 1900;
    hour_one.tm_isdst = -1; 
    hour_two.tm_isdst = -1; 

    printf("\nTEST CASE #5: %d:%dAM w/ 900μs start to %d:%d0AM w/ 0μs end:\n",hour_one.tm_hour,hour_one.tm_min,hour_two.tm_hour,hour_two.tm_min);

    time_t hour_one_secs = mktime(&hour_one);
    time_t hour_two_secs = mktime(&hour_two);

    struct timeval hour_one_timeval;
    struct timeval hour_two_timeval;
    hour_one_timeval.tv_sec = hour_one_secs;
    hour_two_timeval.tv_sec = hour_two_secs;
    // must manually set usecs because time_t does not support microseconds. otherwise it's a junk val that breaks stuff
    hour_one_timeval.tv_usec = 900;
    hour_two_timeval.tv_usec = 0;
    print_time(&hour_one_timeval,&hour_two_timeval);

	return 0;
};

int main(int argc, char* argv[]) {
    struct timeval begin;
    struct timeval ending;
    struct timeval now;
    struct tm birthday_entered;
    time_t birthday;

    printf("___---~~~--- BRIAR'S CODE TIMER ---~~~---____\n\nLet's start with something fun.");

    // don't care about specific hour, so we just start at 00:00:00AM
    birthday_entered.tm_hour = 0;
    birthday_entered.tm_min = 0;
    birthday_entered.tm_sec = 0;
    birthday_entered.tm_isdst = -1; // no daylight saving time, who cares

    //dummy vals
    birthday_entered.tm_mon = -1;
    birthday_entered.tm_mday = -1;
    birthday_entered.tm_year = -1;

    // ask for bday
    while (1) {
        printf("\nEnter your birthday in MM DD YYYY format: ");
        scanf("%d %d %d", &birthday_entered.tm_mon, &birthday_entered.tm_mday, &birthday_entered.tm_year);
        if (!(birthday_entered.tm_mon >= 0 && birthday_entered.tm_mon <= 12 && birthday_entered.tm_mday >= 1 && birthday_entered.tm_mday <= 31 && birthday_entered.tm_year >= 1900)) {
            printf("TRY AGAIN! You input it wrong. Must be at or after 01 01 1900");
            clear_input();
            birthday_entered.tm_mon = -1;
            birthday_entered.tm_mday = -1;
            birthday_entered.tm_year = -1;
        } else {
            clear_input();
            break;
        }
    }
    // convfirm bday
    printf("Your birthday is %d/%d/%d?\n", birthday_entered.tm_mon, birthday_entered.tm_mday, birthday_entered.tm_year);
    // must change entered vals to correct format as tm will take invalid values anyways
    birthday_entered.tm_mon = birthday_entered.tm_mon - 1; //months since jan
    birthday_entered.tm_year = birthday_entered.tm_year - 1900; // years since 1900

    birthday = mktime(&birthday_entered); // convert to secs since jan. 1 1970, we can use this to calc how long it's been since birth
    gettimeofday(&now,NULL); //get whatever time it is now

    // calc details
    // seconds ago is incorrect for dates before 01/01/1970 but somehow it always gets correct hrs/days/years even for dates before 1900. i'm baffled.
    long birthdayseconds = (now.tv_sec - birthday);
    long birthdayhours = birthdayseconds / (60 * 60);
    long birthdaydays = birthdayhours / 24;
    long birthdayyears = birthdaydays / 365;

    //do birthday stuff
    if (birthdayseconds < 0 && birthdayhours <= 0) {
        printf("You haven't been born yet! You will be born in %d seconds, %d hour(s), %d day(s), or roughly %d year(s) from now. Wow!\n",birthdayseconds*-1,birthdayhours*-1,birthdaydays*-1,birthdayyears*-1);
    } else {
        if (birthdayhours < 24) {
            long remaininghrs = 24 - birthdayhours;
            printf("Happy birthday! You have about %d hour(s) left of your birthday today!\n",remaininghrs);
        }
        if (birthday_entered.tm_year+1900 < 1970) { //skipping displaying secs for earlier than 1970
            printf("It has been roughly %d hour(s), %d day(s), or %d year(s) since your birthday. Wow!\n",birthdayhours,birthdaydays,birthdayyears);
        } else {
            printf("It has been roughly %d second(s), %d hour(s), %d day(s), or %d year(s) since your birthday. Wow!\n",birthdayseconds,birthdayhours,birthdaydays,birthdayyears);
        }
    };

    // test

    printf("\nTime to test the timer.");
    start_and_end_timer(&begin,&ending,5,true);
    print_time(&begin, &ending);
    
    // boundary tester for print fn
    boundary_tester();
    return 0;
};