var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2World = Box2D.Dynamics.b2World
    , b2MassData = Box2D.Collision.Shapes.b2MassData
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    , b2WeldJointDef =  Box2D.Dynamics.Joints.b2WeldJointDef
    , b2Shape = Box2D.Collision.Shapes.b2Shape
    , b2Joint = Box2D.Dynamics.Joints.b2Joint
    , b2Settings = Box2D.Common.b2Settings
    ;

var SCALE = 30;
var FPS = 60;
var CANVAS_WIDTH, CANVAS_HEIGHT;

var world, canvas;
var frameNumber = 0;

var mousePressed = false;
var mouseJoint = false;


$(document).ready(function() {
    init();
    canvas.on('click', canvasClicked);

    canvas.mousemove(mouseMove);
    canvas.mousedown(mouseDown);
    canvas.mouseup(mouseUp);
});

function init() {
    canvas = $('#canvas');
    CANVAS_WIDTH = parseInt(canvas.attr('width'));
    CANVAS_HEIGHT = parseInt(canvas.attr('height'));
    setupPhysics();
    setupDebugDraw();

    window.setInterval(update, 1000 / FPS);
}

function toMeters(pixels) {
    return pixels / SCALE;
}

function setupPhysics() {
    var gravity = new b2Vec2(0, 10)
    world = new b2World(gravity, true);

    var CANVAS_WIDTH_M = toMeters(CANVAS_WIDTH);
    var CANVAS_HEIGHT_M = toMeters(CANVAS_HEIGHT);

    // create ground
    var borderWidth = toMeters(1);

    ground = createBox(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH_M * 2, borderWidth, true); // bottom
    createBox(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH_M, borderWidth, true);
    createBox(0, 0, borderWidth, CANVAS_HEIGHT_M, true);
    createBox(CANVAS_WIDTH, 0, borderWidth, CANVAS_HEIGHT_M, true);
}

function setupDebugDraw() {
    var debugDraw = new b2DebugDraw();

    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.7);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    world.SetDebugDraw(debugDraw)
}

function update() {
    world.Step(1/FPS, 10, 10);
    world.DrawDebugData();
    world.ClearForces();

    frameNumber++;
}

function createBall(x, y, radius) {
    x = toMeters(x);
    y = toMeters(y);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.3;
    fixDef.shape = new b2CircleShape(radius);

    body = world.CreateBody(bodyDef);
    body.SetAngle(0)

    fixture = body.CreateFixture(fixDef);
}

function createBox(x, y, width, height, is_static) {
    x = toMeters(x);
    y = toMeters(y);

    var bodyDef = new b2BodyDef;
    bodyDef.type = is_static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.3;

    bodyDef.position.x = x;
    bodyDef.position.y = y;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(width, height);

    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    return body;
}

function getInstrument() {
    return $('#add_object_select').val();
}

function getBodyAtPoint(point, includeStatic) {
    var aabb = new b2AABB();
    aabb.lowerBound.Set(point.x - 0.001, point.y - 0.001);
    aabb.upperBound.Set(point.x + 0.001, point.y + 0.001);

    var body = null;

    console.log(point.x, point.y)

    // Query the world for overlapping shapes.
    function GetBodyCallback(fixture)
    {
        var shape = fixture.GetShape();

        if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic)
        {
            var inside = shape.TestPoint(fixture.GetBody().GetTransform(), point);

            if (inside)
            {
                body = fixture.GetBody();
                return false;
            }
        }

        return true;
    }

    world.QueryAABB(GetBodyCallback, aabb);
    return body;
}

function canvasClicked(event) {
    event.preventDefault();
    event.stopPropagation();
    var x = event.offsetX,
        y = event.offsetY;

    var objectType = getInstrument();

    if(objectType == 'object_ball') {
        radius = +$('.ball_attrs').find('.radius_input').val();
        createBall(x, y, radius);
        $('#add_object_select').val('');
    } else if(objectType == 'object_box') {
        var width = +$('.box_attrs').find('.width_input').val();
        var height = +$('.box_attrs').find('.height_input').val();
        createBox(x, y, width, height);
        $('#add_object_select').val('');
    }
}

function mouseMove(event) {
    var cursorPoint = new b2Vec2(toMeters(event.offsetX), toMeters(event.offsetY));

    if(mousePressed && !mouseJoint && !getInstrument()) {
        event.preventDefault();
        console.log("move")
        var body = getBodyAtPoint(cursorPoint);

        if(body) {
            console.log(body)
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

    if(mouseJoint) {
        mouseJoint.SetTarget(cursorPoint);
    }
}

function mouseDown() {
    mousePressed = true;
};

function mouseUp() {
    mousePressed = false;

    if(mouseJoint) {
        world.DestroyJoint(mouseJoint);
        mouseJoint = false;
    }
};