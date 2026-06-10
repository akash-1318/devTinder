const add1 = (num) => num + 1;
const double = (num) => num * 2;
const subtract10 = (num) => num - 10;

const compose = (...fns) => {
  return function (value) {
    return fns.reduceRight((acc, fn) => {
      return fn(acc)
    }, value)
  };
}

const composedFn = compose(subtract10, double, add1);
console.log("hello", composedFn(3)) // (3 + 1) * 2 - 10 => -2


// .......................................


// setCancellableInterval(): Implement a function similar to setInterval() that returns a function to cancel the interval instead of an ID.

// const cancel = setCancellableInterval(args)


function setCancellableInterval(fn, delay){
  const fnInterval = setInterval(()=>{
    fn()
  }, delay)
return function cancel(){
  clearInterval(fnInterval)
}
}

function test(){
  console.log("hello world")
}

const cancel = setCancellableInterval(test, 1000);

setTimeout(()=>{
  cancel()
  console.log("hello interval")
}, 2000)


// Function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".

function longestCommonPrefix(strs) {
  if (strs.length === 0) return "";
  let prefix = strs[0];
  
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }
  
  return prefix;
}

const strings = ["flower", "flow", "flight"];
console.log(longestCommonPrefix(strings)); // Output: "fl"


// Function to find the most frequent element in an array. If there are multiple elements with the same highest frequency, return any one of them.

function mostFrequentElement(arr) {
  const frequencyMap = {};
  let maxFrequency = 0;
  let mostFrequent = null;

  for (const num of arr) {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;

    if (frequencyMap[num] > maxFrequency) {
      maxFrequency = frequencyMap[num];
      mostFrequent = num;
    }
  }

  return mostFrequent;
}

const array = [1, 2, 3, 2, 4, 1, 2];
console.log(mostFrequentElement(array)); // Output: 2

// Given two integers a and b, return the sum of the two integers without using the operators + and -
function getSum(a, b) {
  while (b !== 0) {
    const carry = a & b; // Calculate carry
    a = a ^ b; // Sum of bits of a and b where at least one of the bits is not set
    b = carry << 1; // Carry is shifted by one so that it can be added in the next iteration
  }
  return a;
}

console.log(getSum(5, 3)); // Output: 8


// Flatten a Nested Array
function flattenArray(arr) {
  const result = [];
  
  function flattenHelper(subArr) {
    for (const item of subArr) {
      if (Array.isArray(item)) {
        flattenHelper(item); // Recursively flatten nested arrays
      } else {
        result.push(item); // Push non-array items to the result
      }
    }
  }
  
  flattenHelper(arr);
  return result;
}

const nestedArray = [1, [2, [3, 4], 5], 6];
console.log(flattenArray(nestedArray)); // Output: [1, 2, 3, 4, 5, 6]