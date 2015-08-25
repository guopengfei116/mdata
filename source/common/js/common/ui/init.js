$(function () {
    setTimeout(function () {
        var initializeList = ['Flag', 'Tooltip', 'Dropdown'];

        var leng = initializeList.length;

        while(leng--) {
            (new window[initializeList[leng]]).init();
        }
    }, 500);
});
