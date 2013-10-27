// convert pixels to meters
function toMeters(pixels) {
    return pixels / SCALE;
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