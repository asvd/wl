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
    
    
    'Emission upon timeout':
    function() {
        var w = new wl.Whenable;
        var ok1 = false;
        w.whenEmitted(function(){
            ok1 = true;
            lighttest.check(true);
        });

        setTimeout(function() {
            w.emit();
        },100);

        var ok2 = false;
        setTimeout(function() {
            w.whenEmitted(function(){
                ok2 = true;
                lighttest.check(true);
            });
        },100);

        var ok3 = false;
        setTimeout(function() {
            w.whenEmitted(function(){
                ok3 = true;
                lighttest.check(true);
            });
        },200);

        setTimeout(function(){
            lighttest.check(ok1&&ok2&&ok3);
            lighttest.done();
        },400);
    },
    
    'Never emitted whenable':
    function() {
        var w = new wl.Whenable;

        var ok = true;
        w.whenEmitted(function(){
            ok = false;
            lighttest.check(false);
        });

        setTimeout(function(){
            lighttest.check(ok);
            lighttest.done();
        },300);
    },
    
    'Transferring argument':
    function() {
        var w = new wl.Whenable;
        var ok = false;
        w.whenEmitted(function(hello, world){
            ok = true;
            lighttest.check(hello == 'hello');
            lighttest.check(world == 'world');
            lighttest.done();
        });

        w.emit('hello', 'world');
        
        setTimeout(function(){
            if (!ok) {
                lighttest.check(false);
                lighttest.done();
            }
        },1000);
    },
    
    
    'Transferring arguments for two listeners':
    function() {
        var w = new wl.Whenable;
        var ok1 = false;
        w.whenEmitted(function(hello, world){
            ok1 = true;
            lighttest.check(hello == 'hello');
            lighttest.check(world == 'world');
        });

        var ok2 = false;
        w.whenEmitted(function(hello, world){
            ok2 = true;
            lighttest.check(hello == 'hello');
            lighttest.check(world == 'world');
        });

        w.emit('hello', 'world');
        
        setTimeout(function(){
            lighttest.check(ok1&&ok2);
            lighttest.done();
        },300);
    },
    
    
    'Applying context':
    function() {
        var w = new wl.Whenable;
        var ok = false;

        var ctx = {
            hello: 'hello',
            world: 'world'
        };

        w.whenEmitted(function(){
            ok = true;
            lighttest.check(this.hello == 'hello');
            lighttest.check(this.world == 'world');
            lighttest.done();
        }, ctx);

        w.emit();
        
        setTimeout(function(){
            if (!ok) {
                lighttest.check(false);
                lighttest.done();
            }
        },1000);
    },
    
    
    'Applying different contexts':
    function() {
        var w = new wl.Whenable;

        var ctx1 = {
            hello1: 'hello1'
        };

        var ok1 = false;
        w.whenEmitted(function(){
            ok1 = true;
            lighttest.check(this.hello1 == 'hello1');
        }, ctx1);

        w.emit();

        var ctx2 = {
            hello2: 'hello2'
        };

        var ok2 = false;
        w.whenEmitted(function(){
            ok2 = true;
            lighttest.check(this.hello2 == 'hello2');
        }, ctx2);

        setTimeout(function(){
            lighttest.check(ok1&&ok2);
            lighttest.done();
        },300);
    },
    
    
    'Applying context and transferring arguments':
    function() {
        var w = new wl.Whenable;
        var ok = false;

        var ctx = {
            hello: 'hello',
            world: 'world'
        };

        w.whenEmitted(function(hello2, world2){
            ok = true;
            lighttest.check(this.hello == 'hello');
            lighttest.check(this.world == 'world');
            lighttest.check(hello2 == 'hello2');
            lighttest.check(world2 == 'world2');
            lighttest.done();
        }, ctx);

        w.emit('hello2','world2');
        
        setTimeout(function(){
            if (!ok) {
                lighttest.check(false);
                lighttest.done();
            }
        },1000);
    },
    
    
};


lighttest.start(tests);

