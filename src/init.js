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
var frame_number = 0;


$(document).ready(function() {
    init();
    canvas.on('click', canvas_clicked);
    $('#add_object_select').on('change', change_add_object);
});

function init() {
    canvas = $('#canvas');
    CANVAS_WIDTH = parseInt(canvas.attr('width'));
    CANVAS_HEIGHT = parseInt(canvas.attr('height'));
    setupPhysics();
    setupDebugDraw();

    window.setInterval(update, 1000 / FPS);
}

function to_meters(pixels) {
    return pixels / SCALE;
}

function setupPhysics() {
    var gravity = new b2Vec2(0, 10)
    world = new b2World(gravity, true);

    var CANVAS_WIDTH_M = to_meters(CANVAS_WIDTH);
    var CANVAS_HEIGHT_M = to_meters(CANVAS_HEIGHT);

    // create ground
    var border_width = to_meters(20);

    createBox(world, CANVAS_WIDTH_M / 2, CANVAS_HEIGHT_M, CANVAS_WIDTH_M * 2, border_width); // bottom

    //createBox(world, CANVAS_WIDTH_M / 2, 0, CANVAS_WIDTH_M, border_width);
    //createBox(world, 0, 0, border_width, CANVAS_HEIGHT_M);
    //createBox(world, CANVAS_WIDTH_M, 0, border_width, CANVAS_HEIGHT_M);
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

    frame_number++;
}

function createBall(x, y, radius) {
    x = to_meters(x);
    y = to_meters(y);

    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.8;
    fixDef.shape = new b2CircleShape(radius);

    body = world.CreateBody(bodyDef);
    body.SetAngle(0)

    fixture = body.CreateFixture(fixDef);
}

function createBox(world, x, y, width, height) {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.8;

    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(width, height);

    world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function canvas_clicked(event) {
    event.preventDefault()
    var x = event.offsetX,
        y = event.offsetY;

    var object_type = $('#add_object_select').val();

    if(object_type == 'object_ball') {
        radius = +$('.ball_attrs').find('.radius_input').val();
        createBall(x, y, radius);
    }
}