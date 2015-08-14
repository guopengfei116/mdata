var a = [1, 2, 3, 4, 5];
var b = [];
for(var i = 0; i < a.length - 1; i++) {
    b.push(a[(i - 1) % a.length + 1]);
}

console.log(b);