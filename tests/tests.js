var tests = {

    'Initialization':
    function() {
        lighttest.check(
            wl &&
            wl.Whenable
        );

        lighttest.done();
    },

    'something':
    function() {
        lighttest.check(true);
        lighttest.done();
    }
};


lighttest.start(tests);

