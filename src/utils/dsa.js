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