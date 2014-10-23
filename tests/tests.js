var tests = {

    'Initialization':
    function() {
        lighttest.check(
            wl &&
            wl.Whenable
        );

        lighttest.done();
    },

    'Emission':
    function() {
        var w = new wl.Whenable;
        var ok = false;
        w.whenEmitted(function(){
            ok = true;
            lighttest.check(true);
            lighttest.done();
        });

        w.emit();
        
        setTimeout(function(){
            if (!ok) {
                lighttest.check(false);
                lighttest.done();
            }
        },1000);
    },
    
    'Subscription after emission':
    function() {
        var w = new wl.Whenable;
        w.emit();

        var ok = false;
        w.whenEmitted(function(){
            ok = true;
            lighttest.check(true);
            lighttest.done();
        });

        setTimeout(function(){
            if (!ok) {
                lighttest.check(false);
                lighttest.done();
            }
        },1000);
    },
    
    
    'Multiple subscriptions':
    function() {
        var w = new wl.Whenable;

        var cb1done = false;
        var cb1 = function() {
            lighttest.check(true);
            cb1done = true;
        };

        var cb2done = false;
        var cb2 = function() {
            lighttest.check(true);
            cb2done = true;
        };
        
        w.whenEmitted(cb1);
        w.whenEmitted(cb2);

        w.emit();
        
        var cb3done = false;
        var cb3 = function() {
            lighttest.check(true);
            cb3done = true;
        };
        

        var cb4done = false;
        var cb4 = function() {
            lighttest.check(true);
            cb4done = true;
        };
        
        w.whenEmitted(cb3);
        w.whenEmitted(cb4);
        

        var ok = false;
        var fin = function() {
            lighttest.check(
                cb1done && cb2done && cb3done && cb4done
            );
            ok = true;
            lighttest.done();
        }
        w.whenEmitted(fin);


        setTimeout(function(){
            if (!ok) {
                lighttest.check(false);
                lighttest.done();
            }
        },1000);
    },
    
};


lighttest.start(tests);

