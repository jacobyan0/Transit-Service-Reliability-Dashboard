var stopID = null;
function initialEvent(id) {
    stopID = id;
}

/**
 * Important class that defines the data structure of the marker object which is used to track all the labels.
 */
class Marker {

    /**
     * Marker object. Should be placed for each label i.e. human placed or AI suggested.
     * @param id ID of the marker. Should be unique for each location.
     * @param type Type of the marker. Should be one of the types defined in the labelsDescriptor.js.
     * @param heading Heading of the marker. Should be between 0 and 360.
     * @param pitch Pitch of the marker. Should be between -90 and 90.
     * @param x X coordinate of the marker in the GSV window. This will not get updated as the GSV is panned.
     * @param y Y coordinate of the marker in the GSV window. This will not get updated as the GSV is panned.
     * @param left Left coordinate of the marker in the GSV window. This will get updated as the GSV is panned.
     * @param top
     * @param verificationState
     */
    constructor(id, type, heading, pitch, x, y, left, top, verificationState, isHumanPlaced, confidence, panoID) {
        this.id = id;
        this.labelType = type;
        this.heading = heading;
        this.pitch = pitch;
        this.originalX = x;
        this.originalY = y;
        this.left = left;
        this.top = top;
        this.verificationState = verificationState;
        this.isHumanPlaced = isHumanPlaced;
        this.confidence = confidence;
        this.panoID = panoID;
    }
}


const HUMAN_VERIFICATION_STATE = {
    'NOT_VERIFIED': 'NOT_VERIFIED',
    'VERIFIED_CORRECT': 'VERIFIED_CORRECT',
    'VERIFIED_INCORRECT': 'VERIFIED_INCORRECT'
}


$(function() {
    let isMouseDown = false;

    let isMarking = false;

    let showMiniLabelUnderCursor = false;

    let currentLabelType = null;

    let inferenceStartTime = null;
    let inferenceEndTime = null;

    let dataIDX = get('idx') ? parseInt(get('idx')) : -1;

    const saveVerifiedLabelCrops = get('saveVerifiedLabelCrops') === '1';

    let missionID = 'test-mission-id';
    const sessionID = get('sessionID') ? get('sessionID') : new Date().getTime().toString(); // Set only once.

    var $panorama = $('#panorama'); // TODO: Check if this is available from the start. What happens if it takes time to load?
    const $dummyImageContainer = $('.dummy-image-container');
    const $panoramaContainer = $('.panorama-container'); // This element is included in the HTML and should be available from the start.

    const $miniLabel = $('.mini-label-icon-for-cursor');

    const IMAGE_SIZE = 640; // This is the size of the image used for training and inference.

    let GSVScaleX = $panoramaContainer.width()/IMAGE_SIZE;
    let GSVScaleY = $panoramaContainer.height()/IMAGE_SIZE;


    const MARKER_DISTANCE_BUFFER = 50;

    const iconsInfo = {}; // This will be initialized by the renderLabels function using labelsDescriptor.


    const DEBUG_MODE = get('debug') === '1';


    // All the label types
    const LABEL_TYPES = {
        0: 'seating',
        1: 'shelter',
        2: 'signage',
        3: 'trashcan'
    }


    // The object to track all the stats related to the current mission.
    const missionStats = {
        'targetLocations': 0,       // Total number of locations to be labeled.
        'completedLocations': 0,    // Number of locations completely labeled. Note: We assume that the user has completely audited a location when they decide to move to a new location.
        // 'stepsTaken': {}            // Map of location ID to number of steps taken to complete the location.
    };

    // The single object to track all the stats related to labels in the current session.
    let labelStats = {
        'nLabelsTotal': 0,
        'nLabelsCorrect': 0,
        'nLabelsIncorrect': 0,
        'nLabelsManuallyPlaced': 0,
        'locationToVerifiedLabels': {}
    };

    // The single object to track all the stats related to the computer vision in the current session.
    // This will be updated later.
    let CVStats = {
        'iouThreshold': 0.5,
        'confidenceThreshold': 0.5,

        'totalInferenceTime': 0,
        'totalInferenceCount': 0
    }


    // Captures the data and state at a particular 'panorama'.
    // All of these should be reset when the user moves to a new location.
    const currentPanoState = {
        location: '',       // todo: update
        markers: [],        // all markers including the non verified ones.
        verifiedLabels: [], // only verified labels.
    }

    const currentLocationState = {
        labelTypeToMarkerCount : {},       // will be initialized right after. Tracks the ID of the next marker to be placed for each label type. Gets reset when moved to a new location.
    }

    // We should have only one place (LABEL_TYPES) where label types are declared. So use a function to initialize.
    function initLabelTypeToMarkerCount() {
        for (const key in LABEL_TYPES) {
            currentLocationState.labelTypeToMarkerCount[LABEL_TYPES[key]] = 0;
        }
    }

    initLabelTypeToMarkerCount();

    // GSV size may potentially change. So we need to update the scale factor.
    // IMAGE_SIZE is the image size used for training and inference.
    function calculateGSVScale() {
        GSVScaleX = $panoramaContainer.width()/IMAGE_SIZE;
        GSVScaleY = $panoramaContainer.height()/IMAGE_SIZE;
    }

    // Updates the dummy-image element with what is currently visible in the GSV.
    // The image can then be used for inference or saving on the server etc.
    function updateDummyImageFromGSV() {

        $('.status-indicator').text('Detecting...').show();

        $dummyImageContainer.css({'height': $panoramaContainer.height(), 'width': $panoramaContainer.width(), 'top': $panoramaContainer.position().top, 'left': $panoramaContainer.position().left});

        var webglImage = (function convertCanvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL('image/jpeg', 1);
            return image;
        })($('.widget-scene-canvas')[0]);

        $('.dummy-image').attr('src', webglImage.src);
    }

    function savePanoContainerScreenshot() {

        const d = {
            'name': 'label-' + currentPanoState.location + '-' + panorama.getPano() + '-' + new Date().getTime() +'.jpg',
        }

        // Save a high-res version of the image.
        html2canvas($panoramaContainer[0]).then(canvas => {

            d.dir = 'labels';
            d.b64 = canvas.toDataURL('image/jpeg', 1);

            $.ajax({
                type: "POST",
                url: "saveImage.jsp",
                data: d,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                success: function(data){
                    console.log(data);
                }
            });
        });

    }


    // Saves a screenshot of the GSV on the server with the name gsv-<panoID>-<timestamp>.jpg.
    function saveGSVScreenshot() {

        $panoramaContainer.css('outline', '10px solid goldenrod');
        setTimeout(function() {
            $panoramaContainer.css('outline', 'none');
        }, 800);

        // Saves a screenshot of the GSV to the server with the name gsv-<panoID>-<timestamp>.jpg
        // Pano ID will help us trace back to the panorama if needed.
        const d = {
            'name': 'gsv-' + currentPanoState.location + '-' + panorama.getPano() + '-' + new Date().getTime() +'.jpg',
        }

        // Save a high-res version of the image.
        html2canvas($('.dummy-image-container')[0]).then(canvas => {

            d.dir = 'high-res';
            d.b64 = canvas.toDataURL('image/jpeg', 1);

            $.ajax({
                type: "POST",
                url: "saveImage.jsp",
                data: d,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                success: function(data){
                    console.log(data);
                }
            });
        });
    }


    // Renders the label toolbar based on the JSON descriptor.
    // Note: this doesn't attach event handlers itself.
    function showLabels() {

        // This function renders the labels in the labels toolbar based on the JSON descriptor.
        function renderLabels(labelGroups) {

            const $labelToolbar = $('.label-toolbar');

            $('.label-group-container:not(.template)').remove();
            $('.label-toolbar-item.place-label:not(.template)').remove();


            for (let i = 0; i < labelGroups.length; i++) {

                const $labelToolbarGroup = $('.label-group-container.template').clone().removeClass('template');
                $('.label-group-title', $labelToolbarGroup).text(labelGroups[i].title);

                const labels = labelGroups[i].labels;

                for (let i = 0; i < labels.length; i++) {
                    const label = labels[i];
                    const $labelButton = $('.label-toolbar-item.place-label.template', $labelToolbarGroup).clone().removeClass('template');
                    $labelButton.attr('data-label-type', label.labelType);
                    $labelButton.addClass(LABEL_TYPES[label.labelType].toLowerCase());

                    $('.label-icon', $labelButton).attr('href', label.icon.id);
                    $('svg', $labelButton).attr('viewBox', label.icon.viewBox);

                    $('.label-toolbar-item-text', $labelButton).text(label.displayName);
                    $('.label-group-content', $labelToolbarGroup).append($labelButton);

                    // Init the iconsInfo object.
                    iconsInfo[LABEL_TYPES[label.labelType]] = label;
                }

                $labelToolbar.append($labelToolbarGroup);
            }
        }

        renderLabels(LabelsDescriptor.labelGroups);
        $('.label-toolbar-overlay-container').show();
    }



    // Removes the marker from the DOM and the currentPanoState.markers array.
    function removeMarkerIfExists(markerID) {

        let result = null;

        $('.marker[data-id=' + markerID + ']').remove();
        for (let i = 0; i < currentPanoState.markers.length; i++) {
            if (currentPanoState.markers[i].id === markerID) {
                result = currentPanoState.markers.splice(i, 1);

                if (DEBUG_MODE) {
                    console.log('Removed marker with ID: ' + markerID);
                }

                return result[0]; // Splice returns an array. We should return only the marker, which is the only element in the array.
            }
        }

        return result;
    }

    /**
     * Important function that places a marker at the given coordinates.
     * Adds the marker to the UI and currentPanoState.markers array.
     * Note: this doesn't remove the marker if it already exists. Use removeMarkerIfExists() for that.
     * @param optionalID ID for the marker. If not provided, it will be auto-generated.
     * @param x X coordinate of the marker in the current GSV window.
     * @param y Y coordinate of the marker in the current GSV window.
     * @param labelType The type of the label. See LABEL_TYPES.
     * @param verificationState The verification state of the label. See HUMAN_VERIFICATION_STATE.
     * @param isHumanPlaced Whether the label was placed by a human or suggested by CV.
     * @param confidence Confidence for the marker suggested by CV. It is 1 if the marker was placed by a human.
     * @param optionalClasses Optional classes to add to the marker.
     * @returns {Marker} The placed marker object.
     */
    function placeMarker(optionalID, x, y, labelType, verificationState, isHumanPlaced, confidence, optionalClasses) {

        const pov = panorama.getPov();
        const position = getPosition(x, y, $panorama.width(), $panorama.height(), pov.zoom, pov.heading, pov.pitch);
        var newCoords = povToPixel3d(position, panorama.getPov(), pov.zoom, $panorama.width(), $panorama.height());

        const $marker = $('.marker.template').clone().removeClass('template');

        $marker.css({'left': newCoords.left, 'top': newCoords.top});

        // Construct a markerID using the labelType and it's current count.
        // Important: this should be the only place where a marker ID is generated.
        const markerID = optionalID ? optionalID : labelType + '-' + currentLocationState.labelTypeToMarkerCount[labelType];

        $marker.attr('data-id', markerID);
        $marker.addClass('marker-' + labelType);

        if (verificationState === HUMAN_VERIFICATION_STATE.NOT_VERIFIED) {
            $marker.addClass('not-verified');
        }

        // If the marker is placed by the user, we should show the respective icon.
        if (isHumanPlaced) {
            $('use', $marker).attr('href', iconsInfo[labelType].icon.id);
            $('svg', $marker).attr('viewBox', iconsInfo[labelType].icon.viewBox);
            $('.marker-icon-container', $marker).show();
        }

        if (optionalClasses) {
            $marker.addClass(optionalClasses);
        }

        $panoramaContainer.append($marker);

        // verification state here could be VERIFIED_CORRECT or NOT_VERIFIED.
        const m = new Marker(markerID, labelType, pov.heading, pov.pitch, x, y, newCoords.left, newCoords.top, verificationState, isHumanPlaced, confidence, panorama.getPano());
        currentPanoState.markers.push(m);

        if (!optionalID) {
            currentLocationState.labelTypeToMarkerCount[labelType]++;   // Increment the count for the label type.
        }

        return m;

    }

    // Moves the already markers when the panorama is moved.
    function moveMarkers() {

        const panoWidth = $panorama.width();
        const panoHeight = $panorama.height();

        const pov = panorama.getPov();

        for (let i = 0; i < currentPanoState.markers.length; i++) {
            const marker = currentPanoState.markers[i];
            const $marker = $('.marker-' + marker.labelType + '[data-id="' + marker.id + '"]');
            const position = getPosition(marker.originalX, marker.originalY, panoWidth, panoHeight, pov.zoom, marker.heading, marker.pitch);
            const newCoords = povToPixel3d(position, pov, pov.zoom, panoWidth, panoHeight);

            if (!newCoords) {
                // console.log('newCoords is null. Marker: ' + JSON.stringify(marker));
                continue;
            }

            $marker.css({'left': newCoords.left, 'top': newCoords.top});
            marker.left = newCoords.left;
            marker.top = newCoords.top;
        }
    }

    /**
     * Updates the verification state of a marker.
     * @param markerID ID of the marker
     * @param verificationState New verification state
     */
    function updateMarkerVerificationState(markerID, verificationState) {
        for (let i = 0; i < currentPanoState.markers.length; i++) {
            const marker = currentPanoState.markers[i];
            if (marker.id === markerID) {
                marker.verificationState = verificationState;
                $('.marker-' + marker.labelType + '[data-id="' + marker.id + '"]').removeClass('not-verified').addClass('verified');
                return marker;
            }
        }
    }

    function updateCurrentStateLocation(locationID) {
        currentPanoState.location = locationID;
    }

    /**
     * Resets the currentPanoState so that the labeling can be started from the beginning.
     */
    function resetCurrentPanoState() {

        function resetCurrentStateUI() {
            $('.marker:not(.template)').remove();
            $('.object-boundary:not(.template)').remove();
        }

        currentPanoState.markers = [];

        currentPanoState.verifiedLabels = [];

        resetCurrentStateUI();
    }

    function resetCurrentLocationState() {
        initLabelTypeToMarkerCount(); // Reset currentLocationState.labelTypeToMarkerCount
    }

    function updateMissionStatsUI() {

        $('.mission-progress-value').text(missionStats.completedLocations);
    }


    function updateStatsUI() {
        $('.n-labels-correct-count').text(labelStats.nLabelsCorrect);
        $('.n-labels-incorrect-count').text(labelStats.nLabelsIncorrect);
        $('.n-labels-total-count').text(labelStats.nLabelsTotal);
    }

    function updateLabelStats(marker) {

        labelStats.nLabelsTotal++;

        if (marker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_CORRECT) {
            labelStats.nLabelsCorrect++;
        } else if (marker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_INCORRECT) {
            labelStats.nLabelsIncorrect++;
        }

        updateStatsUI();

    }

    /**
     * Creates the log data object and posts it to the server.
     */
    function postLogData() {
        const logData = {
            'missionID': missionID,
            'sessionID': sessionID,
            'missionStats': missionStats,
            'CVStats': CVStats,
            'labelStats': labelStats,
            'timestamp': new Date().getTime(),
            'dataIDX': dataIDX,      // Logging to manage in case of a crash. We might not be able to take all the screenshots in one go.
            'stopID': stopID
        };

        const d = {
            'name': 'log-' + sessionID +'.json',
            'data': JSON.stringify(logData)
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost/ontime/Gainesville/backend/saveLogs.php',
            data: d,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (data) {
                console.log('Successfully posted log data to the server.');
            },
            error: function (err) {
                console.log('Error posting log data to the server.');
            }
        });
    }

    function getLocationFromIdx(data, idx) {

        const result = {
            'location': null,
            'locationID': null
        }
        // We right now support two sources of data—King County GIS and Overpass Turbo/OSM.
        // And they both have different formats. This block handles it. This is not the best solution but it works for now.
        if (data.source === 'KCGIS') {
            result.location = [
                data.features[idx].X,
                data.features[idx].Y
            ];
            result.locationID = data.features[idx].OBJECTID;
        } else {
            result.location = data.features[idx].geometry.coordinates; // This currently assumes that the data is available in the Overpass Turbo/OSM format.
            result.locationID = data.features[idx].properties['gtfs:stop_id']; // todo: we should check if this is unique.
        }

        return result;
    }

    function updateLabelStatsLocationToVerifiedLabels() {
        if (!labelStats.locationToVerifiedLabels[currentPanoState.location]) {
            labelStats.locationToVerifiedLabels[currentPanoState.location] = [];
        }

        labelStats.locationToVerifiedLabels[currentPanoState.location] = labelStats.locationToVerifiedLabels[currentPanoState.location].concat(currentPanoState.verifiedLabels);
    }

    // Saves a screenshot with an outline around the object (indicated by the marker) in true-positive or false-potive directory.
    function saveScreenshotWithLabel($objectBoundary, marker) {
        $('.dummy-object-boundary').remove();

        const $objectBoundaryClone = $objectBoundary.clone();
        $objectBoundaryClone.removeClass('object-boundary').addClass('dummy-object-boundary');

        if (marker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_CORRECT) {
            $objectBoundaryClone.addClass('confirmed');
        } else if (marker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_INCORRECT) {
            $objectBoundaryClone.addClass('denied');
        }

        $dummyImageContainer.append($objectBoundaryClone);

        const d = {
            'name': 'label-' + marker.labelType + '-' + currentPanoState.location + '-' + panorama.getPano() + '-' + new Date().getTime() +'.jpg',
        }

        d.dir = 'crops-' + sessionID + '/'; // TODO: this path separator should be handled better. It will break on Windows now.

        // Save a high-res version of the image.
        html2canvas($dummyImageContainer[0]).then(canvas => {

            if (marker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_CORRECT) {
                if (marker.isHumanPlaced) {
                    d.dir += 'false-negative';
                } else {
                    d.dir += 'true-positive';
                }
            } else if (marker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_INCORRECT) {
                d.dir += 'false-positive';
            }

            d.b64 = canvas.toDataURL('image/jpeg', 1);

            $.ajax({
                type: "POST",
                url: "saveImage.jsp",
                data: d,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                success: function(data){
                    console.log(data);
                }
            });
        });
    }

    /**
     * Sets up the event handlers for all the UI elements. This is called only once when the page is loaded.
     */
    function setupEventHandlers() {

        function startLabelingHandler(e) {

            e.preventDefault();
            e.stopPropagation();

            const labelType = $(this).attr('data-label-type');
            currentLabelType = labelType;
            isMarking = true;
            $('.mode-indicator').addClass('marking');

            $('.overlay').css({'pointer-events': 'all'});
            $('.mode-indicator').fadeIn(200);

            showCurrentLabelUnderCursor(e);
        }

        function stopLabelingHandler(e) {

            e.preventDefault();
            e.stopPropagation();

            isMarking = false;
            $('.mode-indicator').removeClass('marking');

            $('.overlay').css({'pointer-events': 'none'});
            $('.mode-indicator').fadeOut(200);

            hideCurrentLabelUnderCursor();
        }

        function showLabelsHandler() {
            $('.actions-toolbar-overlay-container').hide();
            showLabels();
            $('.place-label').click(startLabelingHandler);
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }


        function nextLocationHandler(shouldPickRandomLocation) {

            // First let's save a screenshot.
            // savePanoContainerScreenshot();

            // Then, let's update all the logs needed.

            // Let's update labelStats.
            updateLabelStatsLocationToVerifiedLabels();


            // Let's update mission related stats.
            missionStats.completedLocations++;
            updateMissionStatsUI();

            // Post the log data to server.
            postLogData();

            // Reset the current state so the labeling can be started from the beginning.
            // It is important to do this before starting the next location.
            resetCurrentPanoState();
            resetCurrentLocationState();

            //-----------------//
            // Start the next location.

            if (shouldPickRandomLocation) {
                dataIDX = getRandomInt (0, GIS_DATA.features.length - 1);
            } else {
                dataIDX++;
            }

            // All locations in the current mission have been labeled.
            if (dataIDX === GIS_DATA.features.length) {
                // Do something for completion. Perhaps show an animation!
                // And break.
                doneLabelingHandler();
                return;
            }

            const locationInfo = getLocationFromIdx(GIS_DATA, dataIDX);
            let location = locationInfo.location;
            let locationID = locationInfo.locationID;

            panorama.setPosition({lat: location[1], lng: location[0]});

            const currentPov = panorama.getPov();
            panorama.setPov({heading: currentPov.heading, pitch: currentPov.pitch, zoom: 1}); // Always start with zoom 1.

            console.log("Index: " + dataIDX);
            console.log("Info: " + JSON.stringify(GIS_DATA.features[dataIDX]));


            updateCurrentStateLocation(locationID);

        }

        function previousLocationHandler() {
            dataIDX--;
            const location = GIS_DATA.features[dataIDX].geometry.coordinates;
            panorama.setPosition({lat: location[1], lng: location[0]});

            console.log("Index: " + dataIDX);
            console.log("Info: " + JSON.stringify(GIS_DATA.features[dataIDX]));
        }

        function toggleSidebarHandler() {
            const $sidebar = $('.sidebar');

            let sidebarRight = 0;
            let panoWidth = '70%';


            $sidebar.toggleClass('hide');
            if ($sidebar.hasClass('hide')) {
                sidebarRight = -$sidebar.width(); // 20px for the toggle button
                panoWidth = 'calc(100% - 40px)';
            }

            $sidebar.css({'right': sidebarRight});
            $panoramaContainer.css({'width': panoWidth});

            $dummyImageContainer.css({'height': $panoramaContainer.height(), 'width': $panoramaContainer.width(), 'top': $panoramaContainer.position().top, 'left': $panoramaContainer.position().left});

            // clear existing dummy markers as they might have moved
            $('.dummy-marker:not(.template)').remove();
        }

        function confirmLabelHandler(e) {

            e.preventDefault();
            e.stopPropagation();

            const $closestObjectBoundary = $(e.target).closest('.object-boundary');
            $closestObjectBoundary.addClass('confirmed');

            const id = $closestObjectBoundary.attr('data-id');
            const marker = updateMarkerVerificationState(id, HUMAN_VERIFICATION_STATE.VERIFIED_CORRECT);

            // Add the marker to the current state. We will later log this info.
            const markerClone = structuredClone(marker); // This is a deep clone using new API. We might have to revisit this for better support.
            markerClone.timestamp = new Date().getTime();
            currentPanoState.verifiedLabels.push(markerClone);

            if (saveVerifiedLabelCrops)
                saveScreenshotWithLabel($closestObjectBoundary, marker);

            updateLabelStats(marker);
        }

        function denyLabelHandler(e) {

            e.preventDefault();
            e.stopPropagation();


            const $closestObjectBoundary = $(e.target).closest('.object-boundary');
            $closestObjectBoundary.addClass('denied');

            const id = $closestObjectBoundary.attr('data-id');
            const marker = updateMarkerVerificationState(id, HUMAN_VERIFICATION_STATE.VERIFIED_INCORRECT);

            // Add the marker to the current state. We will later log this info.
            const markerClone = structuredClone(marker); // This is a deep clone using new API. We might have to revisit this for better support.
            markerClone.timestamp = new Date().getTime();
            currentPanoState.verifiedLabels.push(markerClone);

            if (saveVerifiedLabelCrops)
                saveScreenshotWithLabel($closestObjectBoundary, marker);

            updateLabelStats(marker);
        }

        function doneLabelingHandler() {

            // Update label stats.
            updateLabelStatsLocationToVerifiedLabels();

            // Update the stats and relevant UI one last time.
            missionStats.completedLocations++;
            updateMissionStatsUI();

            // Then let's post all the log data to the server.
            postLogData();

            // And, now, let's bring the mission stats panel into the center and focus.
            // Make the user feel good about their contribution. We can also show an animation here.
            $('.mission-stats-panel-container').addClass('focus');
        }

        function moveMiniLabelUnderCursor(e) {

            if (!showMiniLabelUnderCursor) {
                return;
            }

            e.preventDefault();

            $miniLabel.css({'left': e.clientX - ($miniLabel.width()/2), 'top': e.clientY - ($miniLabel.height()/2)});
        }


        // We show the current label with the cursor when the user is marking.
        function showCurrentLabelUnderCursor(e) {

            e.preventDefault();

            $('use', $miniLabel).attr('href', iconsInfo[LABEL_TYPES[currentLabelType]].icon.id);
            $('svg', $miniLabel).attr('viewBox', iconsInfo[LABEL_TYPES[currentLabelType]].icon.viewBox);

            $miniLabel.addClass(LABEL_TYPES[currentLabelType]);

            showMiniLabelUnderCursor = true;

            moveMiniLabelUnderCursor(e);
            $miniLabel.css('display', 'flex');
        }

        function hideCurrentLabelUnderCursor() {

            $miniLabel.removeClass(LABEL_TYPES[currentLabelType]); // We can remove only the currentLabelType as it changes only when the user clicks on a label type again.

            $miniLabel.hide();
            showMiniLabelUnderCursor = false;
        }

        /**
         * Handles the click event on the place label button.
         * @param e Click event
         * @param labelType The type of the label to be placed.
         */
        function placeLabelHandler(e, labelType) {
            e.preventDefault();
            e.stopPropagation();

            const x = e.clientX - $panorama.offset().left;
            const y = e.clientY - $panorama.offset().top;

            const m = placeMarker(null, x, y, labelType, HUMAN_VERIFICATION_STATE.VERIFIED_CORRECT, true, 1, null);

            $('.stop-labeling').click(); // Automatically stop labeling after placing a label

            currentPanoState.verifiedLabels.push(m);

            labelStats.nLabelsManuallyPlaced++;


            if (saveVerifiedLabelCrops) {
                const $dummyObjectBoundary = $('.object-boundary.template').clone().removeClass('template').addClass('confirmed').attr('data-id', m.id);
                $dummyObjectBoundary.addClass('dummy-placed-marker');
                $dummyObjectBoundary.css({'left': m.left, 'top': m.top});
                saveScreenshotWithLabel($dummyObjectBoundary, m);
            }
        }

        $('.next-location-button').click(function() {
            nextLocationHandler(false);
        });
        
        $('.return-home-button').click(function() {
            updateLabelStatsLocationToVerifiedLabels();

            // Update the stats and relevant UI one last time.
            missionStats.completedLocations++;
            updateMissionStatsUI();
            
            postLogData();
            window.location.href = "http://localhost/ontime/Gainesville/index.php?page=busstopcv";
        });
        $('.previous-location').click(previousLocationHandler);

        $('.submit-button').click(doneLabelingHandler);

        $('.show-labels-toolbar').on('click', showLabelsHandler);

        $('.stop-labeling').click(stopLabelingHandler);

        $('.go-back').click(function () {
            $('.label-toolbar-overlay-container').hide();
            $('.actions-toolbar-overlay-container').show();
        });

        $('.save-image').click(updateDummyImageFromGSV);


        $('.toggle-sidebar-button').click(toggleSidebarHandler);

        $(window).on('resize', function(){
           calculateGSVScale();
        });


        $(document).on('click', '.object-boundary-correct', confirmLabelHandler);
        $(document).on('click', '.object-boundary-incorrect', denyLabelHandler);


        // Very important handler to infer objects in the view and show them to the user.
        $('.dummy-image').on('load', analyzeImageAndShowSuggestions);


        $(document).on('keypress', function(e) {
            if (e.ctrlKey && e.key === 's') {
                saveGSVScreenshot();
            }
        });

        $(document).on('mousedown', function () {
            isMouseDown = true;
        })

        $(document).on('mouseup', function (e) {
            isMouseDown = false;

            if ($(e.target).hasClass('widget-scene-canvas')) {
                updateDummyImageFromGSV();
            }
        })


        $(document).on('mousemove', function (e) {
            if (!isMarking && isMouseDown) {
                    moveMarkers();
            }

            if (isMarking) {
                moveMiniLabelUnderCursor(e);
            }
        });

        $panoramaContainer.on('click', function(e) {

            if (isMarking) {
                placeLabelHandler(e, LABEL_TYPES[currentLabelType]);
            } else {
                moveMarkers();
            }
        });


        // panorama object is initialized in JSP.
        panorama.addListener("pov_changed", () => {
            $('.object-boundary:not(.template)').remove();
        });

        // If the user takes steps, then we should reset the markers and currentPanoState.
        panorama.addListener("position_changed", () => {

            updateLabelStatsLocationToVerifiedLabels();

            resetCurrentPanoState();
        });
    }

    const inputShape = [1, 3, IMAGE_SIZE, IMAGE_SIZE];
    const topk = 100;
    const iouThreshold = 0.7;
    const confidenceThreshold = 0.3;

    CVStats.iouThreshold = iouThreshold;
    CVStats.confidenceThreshold = confidenceThreshold;

    // Renders the bounding boxes around objects.
    // Handles scaling to match the panorama size.
    function renderBoundingBoxes(predictedBoundingBoxes) {

        function removeFocusOnLabel() {
            $('.object-boundary').removeClass('unfocused');
        }

        // We are going to re-render all the boxes. So, let's remove all the existing ones.
        $('.object-boundary:not(.template)').remove();

        // Go through all the boxes and render them.
        for (let i = 0; i < predictedBoundingBoxes.length; i++) {
            const box = predictedBoundingBoxes[i];
            const [x, y, w, h] = box.bounding;
            const label = box.label;
            const probability = box.probability.toFixed(2); // We are interested in only 2 decimal places.

            const scaledX = x * GSVScaleX;
            const scaledY = y * GSVScaleY;
            const scaledW = w * GSVScaleX;
            const scaledH = h * GSVScaleY;

            const centerX = scaledX + (scaledW/2);
            const centerY = scaledY + (scaledH/2);


            let closestMarker = null;

            // First let's go through all the markers and compute the distance between center of the box and all the 'translated' old markers of the same label type.
            // We find the closest marker and if it is within a certain distance, we consider it as the existing marker.
            // Note: we can't blindly compare with a distance as another marker of the same label type might be under the threshold but may not be the closest one and appear first in the array.
            for (let j = 0; j < currentPanoState.markers.length; j++) {

                const m = currentPanoState.markers[j];

                if (m.labelType === LABEL_TYPES[label]) {

                    const delta = Math.sqrt(Math.pow(centerX - m.left, 2) + Math.pow(centerY - m.top, 2));

                    // This is how we find the closest marker.
                    if (!closestMarker || delta < closestMarker.delta) {
                        closestMarker = {
                            marker: m,
                            delta: delta
                        }
                    }
                }
            }

            // If the closest marker is within the threshold, then we consider it as the existing marker.
            let existingMarker = closestMarker && closestMarker.delta < MARKER_DISTANCE_BUFFER ? closestMarker.marker : null;

            const $objectBoundary = $('.object-boundary.template').clone().removeClass('template').addClass('object-boundary-' + LABEL_TYPES[label]);

            $objectBoundary.css({
                left: scaledX,
                top: scaledY,
                width: scaledW,
                height: scaledH
            });

            // Showing the confidence level as a tooltip.
            const formattedProbablity = Math.round(probability * 100) + '%';
            $objectBoundary.attr('title', 'Confidence: ' + formattedProbablity);

            $panoramaContainer.append($objectBoundary);

            $('.object-boundary-label-text', $objectBoundary).text(LABEL_TYPES[label]);

            // If the bounding box is too close to the top edge of the screen, the label will be off the screen. So, we need to move it down.
            if ($('.object-boundary-label', $objectBoundary).offset().top < 0) {
                $('.object-boundary-label', $objectBoundary).css('top', '10px');
            }


            // Restore the state if it is an existing marker.
            if (existingMarker) {
                if (existingMarker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_CORRECT) {
                    $objectBoundary.addClass('confirmed');
                } else if (existingMarker.verificationState === HUMAN_VERIFICATION_STATE.VERIFIED_INCORRECT) {
                    $objectBoundary.addClass('denied');
                }

                // Since a marker with this ID already exists, we should remove it before placing a new one with the same id.
                // Note: this function will return null if the marker was not found.
                existingMarker = removeMarkerIfExists(existingMarker.id);
            }

            // Place a dummy label in the center of the box. We will use this to determine if the user has already verified this object.
            const marker = placeMarker(existingMarker ? existingMarker.id : null, centerX, centerY, LABEL_TYPES[label], existingMarker ? existingMarker.verificationState : HUMAN_VERIFICATION_STATE.NOT_VERIFIED, false, probability, 'cv-suggested');
            $objectBoundary.attr('data-id', marker.id);

            // These fields should not be updated at any point.
            marker.originalBoundingBox = [scaledX, scaledY, scaledW, scaledH];
            marker.originalPitch = panorama.getPov().pitch;
            marker.originalHeading = panorama.getPov().heading;


            // When the user hovers on a label we want all the other labels to be unfocused.
            // Note: the event handler needs to be added here as the $objectBoundary is not available until it is rendered and will be removed and re-rendered on the fly.
            $objectBoundary.on('mouseenter', function(e) {
                $objectBoundary.siblings().addClass('unfocused');
            }).on('mouseleave', function(e) {
                removeFocusOnLabel();
            });

        }
    }

    let session = null;
    let nms = null;

    async function loadModels() {
        try {
            // create a new session and load the specific model.
            //
            // the model in this example contains a single MatMul node
            // it has 2 inputs: 'a'(float32, 3x4) and 'b'(float32, 4x3)
            // it has 1 output: 'c'(float32, 3x3)
            session = await ort.InferenceSession.create('./models/june-30.onnx');
            nms = await ort.InferenceSession.create('./models/nms-yolov8.onnx');

        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Preprocessing image
     * @param {HTMLImageElement} source image source
     * @param {Number} modelWidth model input width
     * @param {Number} modelHeight model input height
     * @return preprocessed image and configs
     */
    const preprocessing = (source, modelWidth, modelHeight) => {
        const mat = cv.imread(source); // read from img tag
        const matC3 = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3); // new image matrix
        cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR

        // padding image to [n x n] dim
        const maxSize = Math.max(matC3.rows, matC3.cols); // get max size from width and height
        const xPad = maxSize - matC3.cols, // set xPadding
            xRatio = maxSize / matC3.cols; // set xRatio
        const yPad = maxSize - matC3.rows, // set yPadding
            yRatio = maxSize / matC3.rows; // set yRatio
        const matPad = new cv.Mat(); // new mat for padded image
        cv.copyMakeBorder(matC3, matPad, 0, yPad, 0, xPad, cv.BORDER_CONSTANT); // padding black

        const input = cv.blobFromImage(
            matPad,
            1 / 255.0, // normalize
            new cv.Size(modelWidth, modelHeight), // resize to model input size
            new cv.Scalar(0, 0, 0),
            true, // swapRB
            false // crop
        ); // preprocessing image matrix

        // release mat opencv
        mat.delete();
        matC3.delete();
        matPad.delete();

        return [input, xRatio, yRatio];
    };

    async function analyzeImageAndShowSuggestions() {

        inferenceStartTime = new Date().getTime();

        const image = $('.dummy-image')[0];

        const [modelWidth, modelHeight] = inputShape.slice(2);
        const [input, xRatio, yRatio] = preprocessing(image, modelWidth, modelHeight);

        const tensor = new ort.Tensor("float32", input.data32F, inputShape); // to ort.Tensor
        const config = new ort.Tensor("float32", new Float32Array([topk, iouThreshold, confidenceThreshold])); // nms config tensor
        const { output0 } = await session.run({ images: tensor }); // run session and get output layer
        const { selected } = await nms.run({ detection: output0, config: config }); // perform nms and filter boundingBoxes

        if (DEBUG_MODE)
            console.log(selected);

        const boundingBoxes = [];

        // looping through output
        for (let idx = 0; idx < selected.dims[1]; idx++) {
            const data = selected.data.slice(idx * selected.dims[2], (idx + 1) * selected.dims[2]); // get rows
            const box = data.slice(0, 4);
            const scores = data.slice(4); // classes probability scores
            const score = Math.max(...scores); // maximum probability scores
            const label = scores.indexOf(score); // class id of maximum probability scores

            const [x, y, w, h] = [
                (box[0] - 0.5 * box[2]) * xRatio, // upscale left
                (box[1] - 0.5 * box[3]) * yRatio, // upscale top
                box[2] * xRatio, // upscale width
                box[3] * yRatio, // upscale height
            ]; // keep boundingBoxes in maxSize range

            boundingBoxes.push({
                label: label,
                probability: score,
                bounding: [x, y, w, h], // upscale box
            }); // update boundingBoxes to draw later
        }

        // console.log(boundingBoxes);

        renderBoundingBoxes(boundingBoxes); // Draw boundingBoxes

        if (boundingBoxes.length === 0) {
            $('.status-indicator').text('No objects detected. Try moving the panorama or zooming in.').show();
        } else {
            $('.status-indicator').hide();
        }

        inferenceEndTime = new Date().getTime();
        console.log('Time taken: ' + (inferenceEndTime - inferenceStartTime) + 'ms');

        CVStats.totalInferenceTime += (inferenceEndTime - inferenceStartTime);
        CVStats.totalInferenceCount += 1;
    }

    function setupUI() {

        $('.mission-target-value').text(missionStats.targetLocations);
        $('.mission-progress-value').text(missionStats.completedLocations);
    }

    function init() {
        missionStats.targetLocations = GIS_DATA.features.length;

        // Init the currentPanoState object.
        resetCurrentPanoState();
        resetCurrentLocationState();

        // If the user has provided a idx, init the panorama to that location.
        if (dataIDX > -1) {

            const locationInfo = getLocationFromIdx(GIS_DATA, dataIDX);
            let location = locationInfo.location;
            let locationID = locationInfo.locationID;
            updateCurrentStateLocation(locationID);

            panorama.setPosition({lat: location[1], lng: location[0]});
        }
    }

    function main() {
        init();

        setupUI();

        setupEventHandlers();

        calculateGSVScale();
        loadModels();

        updateStatsUI();

        // Simulating a click right upon loading as we want to show the labeling interface by default.
        $('.show-labels-toolbar').click();
    }

    // Google Streetview loads async through a callback function. So, when we reach this point, the pano may or may
    // not be initialized.
    // If it is initialized, we can directly call main() which will setup the UI and event handlers etc.
    // Otherwise, we will attach an event listener to the document itself and wait for the pano to be initialized.
    // The callback function triggers this event and we can then call main().
    if (panorama) {
        main();
    } else {
        $(document).on('pano-initialized', main);
    }

});

