
const num = 123;
const maxRedigit = (num) => parseInt(String(num)
    .split("")
    .reverse()
    .join(""), 10);
    
console.log(maxRedigit(num)) /// => 321


/////////////////////////////////////////////