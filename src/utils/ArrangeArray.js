export function maxSubArrays(arr) {
    // console.log(arr)
    arr.sort((a, b) => b.width - a.width);
    const used = new Array(arr.length).fill(false); 
    const result = [];
    let count = 0;

    function backtrack(target, currentGroup, start) {
        if (target === 0) {
            result.push([...currentGroup]); 
            count++; 
            return true;
        }
        if (target < 0) return false; 

        for (let i = start; i < arr.length; i++) {
            if (!used[i] && target >= arr[i].width) {
                used[i] = true; 
                currentGroup.push(arr[i]); 
                if (backtrack(target - arr[i].width, currentGroup, i + 1)) {
                    return true; 
                }
                currentGroup.pop();
                used[i] = false;
            }
        }
        return false;
    }

    while (true) {
        const currentGroup = [];
        if (!backtrack(12, currentGroup, 0)) break; 
    }
    const remaining = arr.filter((_, index) => !used[index]);

    return { count, subarrays: result, remaining };
}


 