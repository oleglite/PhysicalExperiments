var mousePressed = false;
var mouseJoint = false;

function canvasClicked(event) {
    event.preventDefault();
    event.stopPropagation();
    var x = event.offsetX,
        y = event.offsetY;

    var objectType = getInstrument();

    if(objectType == 'object_ball') {
        var radius = +$('.ball_attrs').find('.radius_input').val();
        createBall(x, y, radius);
    } else if(objectType == 'object_box') {
        var width = +$('.box_attrs').find('.width_input').val();
        var height = +$('.box_attrs').find('.height_input').val();
        createBox(x, y, width, height);
    }
}

function mouseMove(event) {
    var cursorPoint = new b2Vec2(toMeters(event.offsetX), toMeters(event.offsetY));

    if(mouseJoint) {
        mouseJoint.SetTarget(cursorPoint);
    }
}

function mouseDown(event) {
    mousePressed = true;
    var cursorPoint = new b2Vec2(toMeters(event.offsetX), toMeters(event.offsetY));

    if(mousePressed && !mouseJoint && !getInstrument()) {
        event.preventDefault();
        var body = getBodyAtPoint(cursorPoint);

        if(body) {
            // create joint between body and cursor

            var def = new b2MouseJointDef();
            def.bodyA = ground;
            def.bodyB = body;
            def.target = cursorPoint;
            def.collideConnected = true;
            def.maxForce = 10000 * body.GetMass();
            def.dampingRatio = 0;

            mouseJoint = world.CreateJoint(def);

            body.SetAwake(true);
        }
    }
};

function mouseUp() {
    mousePressed = false;

    if(mouseJoint) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = false;
    }
};