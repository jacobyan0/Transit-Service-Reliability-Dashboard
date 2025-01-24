function get(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function isMobile() {
    return false;
}

/**
 * Calculates heading and pitch for a Google Maps marker using (x, y) coordinates
 * From PanoMarker spec
 * @param canvas_x          X coordinate (pixel) of the label
 * @param canvas_y          Y coordinate (pixel) of the label
 * @param canvas_width      Original canvas width
 * @param canvas_height     Original canvas height
 * @param zoom              Original zoom level of the label
 * @param heading           Original heading of the label
 * @param pitch             Original pitch of the label
 * @returns {{heading: float, pitch: float}}
 */
function getPosition(canvas_x, canvas_y, canvas_width, canvas_height, zoom, heading, pitch) {
    function sgn(x) {
        return x >= 0 ? 1 : -1;
    }

    let PI = Math.PI;
    let cos = Math.cos;
    let sin = Math.sin;
    let tan = Math.tan;
    let sqrt = Math.sqrt;
    let atan2 = Math.atan2;
    let asin = Math.asin;
    let fov = _get3dFov(zoom) * PI / 180.0;
    let width = canvas_width;
    let height = canvas_height;
    let h0 = heading * PI / 180.0;
    let p0 = pitch * PI / 180.0;
    let f = 0.5 * width / tan(0.5 * fov);
    let x0 = f * cos(p0) * sin(h0);
    let y0 = f * cos(p0) * cos(h0);
    let z0 = f * sin(p0);
    let du = (canvas_x) - width / 2;
    let dv = height / 2 - (canvas_y - 5);
    let ux = sgn(cos(p0)) * cos(h0);
    let uy = -sgn(cos(p0)) * sin(h0);
    let uz = 0;
    let vx = -sin(p0) * sin(h0);
    let vy = -sin(p0) * cos(h0);
    let vz = cos(p0);
    let x = x0 + du * ux + dv * vx;
    let y = y0 + du * uy + dv * vy;
    let z = z0 + du * uz + dv * vz;
    let R = sqrt(x * x + y * y + z * z);
    let h = atan2(x, y);
    let p = asin(z / R);
    return {
        heading: h * 180.0 / PI,
        pitch: p * 180.0 / PI
    };
}

/**
 * From PanoMarker spec
 * @param zoom
 * @returns {number}
 */
function _get3dFov (zoom) {
    return zoom <= 2 ?
        126.5 - zoom * 36.75 :  // linear descent
        195.93 / Math.pow(1.92, zoom); // parameters determined experimentally
}

/**
 * From PanoMarker spec
 * @param zoom
 * @returns {number}
 */
function get3dFov (zoom) {
    return zoom <= 2 ?
        126.5 - zoom * 36.75 :  // linear descent
        195.93 / Math.pow(1.92, zoom); // parameters determined experimentally
}

/**
 * Given the current POV, this method calculates the Pixel coordinates on the
 * given viewport for the desired POV. All credit for the math this method goes
 * to user3146587 on StackOverflow: http://goo.gl/0GGKi6
 *
 * My own approach to explain what is being done here (including figures!) can
 * be found at http://martinmatysiak.de/blog/view/panomarker
 *
 * @param {StreetViewPov} targetPov The point-of-view whose coordinates are
 *     requested.
 * @param {StreetViewPov} currentPov POV of the viewport center.
 * @param {number} zoom The current zoom level.
 * @param {number} Width of the panorama canvas.
 * @param {number} Height of the panorama canvas.
 * @return {Object} Top and Left offsets for the given viewport that point to
 *     the desired point-of-view.
 */
function povToPixel3d (targetPov, currentPov, zoom, canvasWidth, canvasHeight) {

    // Gather required variables and convert to radians where necessary
    let width = canvasWidth;
    let height = canvasHeight;

    // Corrects width and height for mobile phones
    if (isMobile()) {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    let target = {
        left: width / 2,
        top: height / 2
    };

    let DEG_TO_RAD = Math.PI / 180.0;
    let fov = _get3dFov(zoom) * DEG_TO_RAD;
    let h0 = currentPov.heading * DEG_TO_RAD;
    let p0 = currentPov.pitch * DEG_TO_RAD;
    let h = targetPov.heading * DEG_TO_RAD;
    let p = targetPov.pitch * DEG_TO_RAD;

    // f = focal length = distance of current POV to image plane
    let f = (width / 2) / Math.tan(fov / 2);

    // our coordinate system: camera at (0,0,0), heading = pitch = 0 at (0,f,0)
    // calculate 3d coordinates of viewport center and target
    let cos_p = Math.cos(p);
    let sin_p = Math.sin(p);

    let cos_h = Math.cos(h);
    let sin_h = Math.sin(h);

    let x = f * cos_p * sin_h;
    let y = f * cos_p * cos_h;
    let z = f * sin_p;

    let cos_p0 = Math.cos(p0);
    let sin_p0 = Math.sin(p0);

    let cos_h0 = Math.cos(h0);
    let sin_h0 = Math.sin(h0);

    let x0 = f * cos_p0 * sin_h0;
    let y0 = f * cos_p0 * cos_h0;
    let z0 = f * sin_p0;

    let nDotD = x0 * x + y0 * y + z0 * z;
    let nDotC = x0 * x0 + y0 * y0 + z0 * z0;

    // nDotD == |targetVec| * |currentVec| * cos(theta)
    // nDotC == |currentVec| * |currentVec| * 1
    // Note: |currentVec| == |targetVec| == f

    // Sanity check: the vectors shouldn't be perpendicular because the line
    // from camera through target would never intersect with the image plane
    if (Math.abs(nDotD) < 1e-6) {
        return null;
    }

    // t is the scale to use for the target vector such that its end
    // touches the image plane. It's equal to 1/cos(theta) ==
    //     (distance from camera to image plane through target) /
    //     (distance from camera to target == f)
    let t = nDotC / nDotD;

    // Sanity check: it doesn't make sense to scale the vector in a negative
    // direction. In fact, it should even be t >= 1.0 since the image plane
    // is always outside the pano sphere (except at the viewport center)
    if (t < 0.0) {
        return null;
    }

    // (tx, ty, tz) are the coordinates of the intersection point between a
    // line through camera and target with the image plane
    let tx = t * x;
    let ty = t * y;
    let tz = t * z;

    // u and v are the basis vectors for the image plane
    let vx = -sin_p0 * sin_h0;
    let vy = -sin_p0 * cos_h0;
    let vz = cos_p0;

    let ux = cos_h0;
    let uy = -sin_h0;
    let uz = 0;

    // normalize horiz. basis vector to obtain orthonormal basis
    let ul = Math.sqrt(ux * ux + uy * uy + uz * uz);
    ux /= ul;
    uy /= ul;
    uz /= ul;

    // project the intersection point t onto the basis to obtain offsets in
    // terms of actual pixels in the viewport
    let du = tx * ux + ty * uy + tz * uz;
    let dv = tx * vx + ty * vy + tz * vz;

    // use the calculated pixel offsets
    target.left += du;
    target.top -= dv;

    return target;
}

function projectLat(lat, height) {
    if (isNaN(lat) || typeof lat !== 'number' || lat < -90 || lat > 90) {
        throw new Error('latitude is not valid');
    }
    if (isNaN(height) || typeof height !== 'number'){
        throw new Error('viewport height is not valid');
    }
    return ((lat - 90) / -180 * height);
}

function projectLng(lng, width) {
    if (isNaN(lng) || typeof lng !== 'number' || lng < -180 || lng > 180) {
        throw new Error('longitude is not valid');
    }
    if (isNaN(width) || typeof width !== 'number'){
        throw new Error('viewport width is not valid');
    }
    return (lng + 180) / 360 * width;
}

function project(lng, lat, width) {
    return {
        left: projectLng(lng, width),
        top: projectLat(lat, width / 2)
    };
}

/**
 * Returns the pov of this label if it were centered based on panorama's POV using panorama XY coordinates.
 *
 * @param panoX
 * @param panoY
 * @param panoWidth
 * @param panoHeight
 * @returns {{heading: Number, pitch: Number}}
 */
function calculatePovFromPanoXY(panoX, panoY, panoWidth, panoHeight) {
    return {
        heading: (panoX / panoWidth) * 360 % 360,
        pitch: (panoY / (panoHeight / 2) * 90)
    };
}

/***
 * For a point centered at `povIfCentered`, compute canvas XY coordinates at `currentPov`.
 * @return {Object} Top and Left offsets for the given viewport that point to the desired point-of-view.
 */
function povToPixel3DOffset(povIfCentered, currentPov, canvasWidth, canvasHeight) {
    // Gather required variables and convert to radians where necessary.
    var target = {
        left: canvasWidth / 2,
        top: canvasHeight / 2
    };

    var DEG_TO_RAD = Math.PI / 180.0;
    var fov = get3dFov(currentPov.zoom) * DEG_TO_RAD;
    var h0 = currentPov.heading * DEG_TO_RAD;
    var p0 = currentPov.pitch * DEG_TO_RAD;
    var h = povIfCentered.heading * DEG_TO_RAD;
    var p = povIfCentered.pitch * DEG_TO_RAD;

    // f = focal length = distance of current POV to image plane.
    var f = (canvasWidth / 2) / Math.tan(fov / 2);

    // Our coordinate system: camera at (0,0,0), heading = pitch = 0 at (0,f,0).
    // Calculate 3d coordinates of viewport center and target.
    var cos_p = Math.cos(p);
    var sin_p = Math.sin(p);

    var cos_h = Math.cos(h);
    var sin_h = Math.sin(h);

    var x = f * cos_p * sin_h;
    var y = f * cos_p * cos_h;
    var z = f * sin_p;

    var cos_p0 = Math.cos(p0);
    var sin_p0 = Math.sin(p0);

    var cos_h0 = Math.cos(h0);
    var sin_h0 = Math.sin(h0);

    var x0 = f * cos_p0 * sin_h0;
    var y0 = f * cos_p0 * cos_h0;
    var z0 = f * sin_p0;

    var nDotD = x0 * x + y0 * y + z0 * z;
    var nDotC = x0 * x0 + y0 * y0 + z0 * z0;

    // nDotD == |targetVec| * |currentVec| * cos(theta)
    // nDotC == |currentVec| * |currentVec| * 1
    // Note: |currentVec| == |targetVec| == f

    // Sanity check: the vectors shouldn't be perpendicular because the line
    // from camera through target would never intersect with the image plane.
    if (Math.abs(nDotD) < 1e-6) {
        return null;
    }

    // t is the scale to use for the target vector such that its end
    // touches the image plane. It's equal to 1/cos(theta) ==
    //     (distance from camera to image plane through target) /
    //     (distance from camera to target == f)
    var t = nDotC / nDotD;

    // Sanity check: it doesn't make sense to scale the vector in a negative direction. In fact, it should even be
    // t >= 1.0 since the image plane is always outside the pano sphere (except at the viewport center).
    if (t < 0.0) {
        return null;
    }

    // (tx, ty, tz) are the coordinates of the intersection point between a
    // line through camera and target with the image plane.
    var tx = t * x;
    var ty = t * y;
    var tz = t * z;

    // u and v are the basis vectors for the image plane.
    var vx = -sin_p0 * sin_h0;
    var vy = -sin_p0 * cos_h0;
    var vz = cos_p0;

    var ux = cos_h0;
    var uy = -sin_h0;
    var uz = 0;

    // Normalize horiz. basis vector to obtain orthonormal basis.
    var ul = Math.sqrt(ux * ux + uy * uy + uz * uz);
    ux /= ul;
    uy /= ul;
    uz /= ul;

    // Project the intersection point t onto the basis to obtain offsets in terms of actual pixels in the viewport.
    var du = tx * ux + ty * uy + tz * uz;
    var dv = tx * vx + ty * vy + tz * vz;

    // Use the calculated pixel offsets.
    target.left += du;
    target.top -= dv;
    return target;
}