/**
 * Created by James on 2019/6/3.
 */

;(function () {
    window.onload = function () {
        var scrollSize = document.getElementsByClassName("book-directory book-directory bought")[0];
        // 拿到当前页面的href
        var num = parseInt(window.location.pathname.split("/")[2]);
        // console.log(parseInt(test));

        if (num>=8) {
            scrollSize.scrollTop = num *50;
        }
        var container = document.getElementsByClassName("center");

        for (var i = 0; i < container.length; i++) {
            var singerContain = container[i];
            singerContain.onclick = singerContainClick;
            singerContain.setAttribute("index", i);
        }

        function singerContainClick() {
            var index = parseInt(this.getAttribute("index")) + 1;
            window.location.href = index.toString() + '.htm';
        }

        console.log(container.getAttribute("index"));

    };
})();