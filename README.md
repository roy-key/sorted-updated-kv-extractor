# sorted-updated-kv-extractor
The extractor will receive a list of segments, which each segment would have a list of sorted key-value pairs, and will print in alphabetically order all the key-value pairs from all the segments

In each segment a key can appear at most one time, but the same key could be in another segment.
then the key-value pair should be taken from the most updated segment, i.e the segment which has the bigger index in the segments array.

Currently, for simplicity and understating, all the segments data is loaded into memory.
To support very big segments it could be loaded in chucks of data from files or db;

 
#### SortedUpdatedKeyValueExtractor

Each time the first M of key-value pairs will be loaded from all the N segments, and after it, another M
key-value pairs would be loaded from that specific segment, until all its kv would be handled.

the algorithm would halt after all the kv from all the segments had been handled.

Complexity:
 
 Where there are N segments and M is the biggest amount of kv from some segment I where 0<=I<=N.
 Each insertion to the Segmented min heap is of O(log(M)).

    Run time: O(N) * (M) * O(log(N)) = O(N*M*log(N)).
    Memory: O(N) additional space.
   
    
#### OptimizedSortedUpdatedKeyValueExtractor
This package also supports an optimized OptimizedSortedUpdatedKeyValueExtractor, which implements the same logic as the SortedUpdatedKeyValueExtractor in a different way.

    With additional max O(N) memory, it will visit all N*M key-values, but will insert each key only once, meaning that the O(log(M)) insertions will be as many times as the number of different keys.
        
 If the number of segments (N) is significantly large and its not likely that a key would be updated much, use the SortedUpdatedKeyValueExtractor, else, always prefer the OptimizedSortedUpdatedKeyValueExtractor 



## How to use

1. npm install
2. Create an instance of either SortedUpdatedKeyValueExtractor, OptimizedSortedUpdatedKeyValueExtractor and print the segments.

There are some examples in the tests which could assist