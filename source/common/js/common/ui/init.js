$(function () {
    var initializeList = ['Flag'];

    var leng = initializeList.length;

    while(leng--) {
        (new window[initializeList[leng]]).init();
    }
});
