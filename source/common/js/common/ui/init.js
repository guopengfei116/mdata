$(function () {
    setTimeout(function () {
        var initializeList = ['Flag', 'Tooltip'];

        var leng = initializeList.length;

        while(leng--) {
            (new window[initializeList[leng]]).init();
        }
    }, 500);
});
