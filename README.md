# sorted-updated-kv-extractor

Overview:
A segment is a a datastructure which holds multiply key-value pairs, sorted alphabetically.
For example, this is a segment: ['a:1', 'b:1'].
A key could be in multiple segments, therefore the most updated value for a key will be in the last segment,
For example, this is the list of segments: [['a:1', 'b:1'], ['b:2', 'c:2']] then the updated value for the key - b, whould be 2.

The extractor will receive a list of segments and will print in alphabetically order all the updated key-value pairs from all the segments.
In our examle, the extractor would print : a:1, b:2, c:2.

Notice that in each segment a key can appear at most one time.

## Use cases

When batch handling massive amount of data, which should be manipulated, inserted to a DB for example in a dump process cron scheduled, we whould like to take the most updated value for a key in the most effienct way.

## This projects supports two kinds of extractors 

 
### SortedUpdatedKeyValueExtractor

Each time the first M of key-value pairs will be loaded from all the N segments, and after it, another M
key-value pairs would be loaded from that specific segment, until all its kv would be handled.

the algorithm would halt after all the kv from all the segments had been handled.

Complexity:
 
 Where there are N segments and M is the biggest amount of kv from some segment I where 0<=I<=N.
 Each insertion to the Segmented min heap is of O(log(M)).

    Run time: O(N) * (M) * O(log(N)) = O(N*M*log(N)).
    Memory: O(N) additional space.
   
    
### OptimizedSortedUpdatedKeyValueExtractor
This package also supports an optimized OptimizedSortedUpdatedKeyValueExtractor, which implements the same logic as the SortedUpdatedKeyValueExtractor in a different way.

    With additional max O(N) memory, it will visit all N*M key-values, but will insert each key only once, meaning that the O(log(M)) insertions will be as many times as the number of different keys.
        
 If the number of segments (N) is significantly large and its not likely that a key would be updated much, use the SortedUpdatedKeyValueExtractor, else, always prefer the OptimizedSortedUpdatedKeyValueExtractor 


## How to use

1. npm install
2. Create an instance of either SortedUpdatedKeyValueExtractor, OptimizedSortedUpdatedKeyValueExtractor and print the segments.

There are some examples in the tests which could assist
