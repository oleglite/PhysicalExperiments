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
    fixDef.restitution = 0.1;
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
    fixDef.density = 1;
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

