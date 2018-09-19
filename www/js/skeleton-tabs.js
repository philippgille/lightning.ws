(function() {
    function main() {
        var tabButtons = [].slice.call(document.querySelectorAll('ul.tab-nav li a.button'));

        tabButtons.map(function(button) {
            var contentId = button.parentElement.parentElement.getAttribute('data-tabcontentid');
            var tabNavId = button.parentElement.parentElement.getAttribute('id');
            button.addEventListener('click', function() {
                document.querySelector('#' + tabNavId + ' li a.active.button').classList.remove('active');
                button.classList.add('active');

                document.querySelector('#' + contentId + ' .tab-pane.active').classList.remove('active');
                document.querySelector(button.getAttribute('data-tabid')).classList.add('active');
            })
        })
    }

    if (document.readyState !== 'loading') {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main);
    }
})();