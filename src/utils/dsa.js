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