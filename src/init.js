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

    window.setInterval(updateCanvas, 1000 / FPS);
}

function setupPhysics() {
    var gravity = new b2Vec2(0, 10)
    world = new b2World(gravity, true);

    var CANVAS_WIDTH_M = toMeters(CANVAS_WIDTH);
    var CANVAS_HEIGHT_M = toMeters(CANVAS_HEIGHT);
    var borderWidth = toMeters(1);

    // create bounds
    // bottom
    ground = createBox(CANVAS_WIDTH / 2, CANVAS_HEIGHT, CANVAS_WIDTH_M * 2, borderWidth, true);
    // top
    createBox(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH_M, borderWidth, true);
    // left
    createBox(0, 0, borderWidth, CANVAS_HEIGHT_M, true);
    // right
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

function updateCanvas() {
    world.Step(1/FPS, 10, 10);
    world.DrawDebugData();
    world.ClearForces();

    frameNumber++;
}