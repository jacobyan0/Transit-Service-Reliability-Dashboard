<style>
    #map {
        height: 100%;
    }
</style>
<script>
  <?php include 'js/feedback.js'?>
</script>
<div class="bg-green-700/40 shadow-lg h-5/6 flex flex-row pt-4 pb-4">
    <div class="px-4 w-1/3 text-base-content overflow-auto">
        <form id="feedbackForm" action='backend/user_feedback/add.php' method='post'>
            <div class="bg-white/60 p-4 rounded-lg">
                <div class="text-3xl md:text-3xl font-bold font-sans text-slate-900/75 mb-2">Feedback</div>
                <select onchange="selectReport(this.value)" id="reportSelection" name="type" class="w-full px-2 p-1 rounded-lg hover:bg-green-700/50 bg-[#448b5c]/50 font-bold">
                    <option selected disabled>Select Report</option>
                    <option value="general">Leave Feedback</option>
                    <option value="incident">Report an Incident</option>
                </select>
                <div id="formDropdown" class="hidden font-bold">
                    <div class="divider mb-1 mt-1"></div> 
                    <select onchange="selectForm(this.value)" id="formSelection" name="form" class="w-full px-2 p-1 rounded-lg hover:bg-green-700/50 bg-[#448b5c]/50 font-bold">
                        <option selected disabled>Select Form</option>
                        <option value="general">General</option>
                        <option value="stop">Stop</option>
                        <option value="route">Route</option>
                    </select>
                    <div class="mt-1 text-center font-semibold text-sm">or click on the map to report on a specific location.</div>
                </div>
                <div class="divider mb-1 mt-1"></div> 
                <div id="route" class="hidden font-semibold text-base-content">
                    <div>Bus ID (if applicable):</div>
                    <input type="number" id="message" name="bus" class="px-2 p-1 w-full rounded-lg"></input>
                    <select id="routeselection" name="route" onchange="showRouteLayer(this.value)" class="mt-3 hover:bg-slate-400/50 bg-slate-400/30 font-semibold rounded-lg px-2 p-1 w-full">
                        <option disabled selected value="n/a">Select Route</option>
                        <?php
                            $sql = "SELECT `route_id`, `route_name`, `route_color` FROM `routes` ORDER BY `routes`.`route_id` ASC";
                            $result = $conn->query($sql);
                            if ($result->num_rows > 0) {
                            // Output data of each row
                            while ($row = $result->fetch_assoc()) {
                                //echo "<div class='collapse'>";
                                $routeid = $row['route_id'];
                                echo "<option value='$routeid'>Route $routeid</option>";
                            }
                            } else {
                            echo "No routes found";
                            }
                        ?>
                    </select>
                </div>
                <div id="stop" class="hidden font-semibold text-base-content">
                    <label class="flex w-full items-center gap-2">
                        <input type="text" class="grow rounded-lg px-2 p-1" maxlength="50" onkeyup="searchMarkers()" onkeydown="searchMarkers()" id="stopSearchInput" placeholder="Search for stops" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                    </label>
                    <select id="stoprouteselection" onchange="stopsAlongRoute(this.value)" class="mt-3 hover:bg-slate-400/50 bg-slate-400/30 font-semibold rounded-lg px-2 p-1 w-full">
                        <option disabled selected value="none">View Stops</option>
                        <option value="all">View All Stops</option>
                        <option value="clear">Clear Stops</option>
                        <?php
                            $sql = "SELECT `route_id`, `route_name`, `route_color` FROM `routes` ORDER BY `routes`.`route_id` ASC";
                            $result = $conn->query($sql);
                            if ($result->num_rows > 0) {
                            // Output data of each row
                            while ($row = $result->fetch_assoc()) {
                                //echo "<div class='collapse'>";
                                $routeid = $row['route_id'];
                                echo "<option value='$routeid'>Route $routeid</option>";
                            }
                            } else {
                            echo "No routes found";
                            }
                        ?>
                    </select>
                </div>
                <div id="default" class="hidden font-semibold text-base-content">
                    <div>Time:</div>
                    <input type="time" id="incident-time" name="time" class="rounded-lg px-2 w-full">
                    <div class="mt-2">Date:</div>
                    <input type='date' name='date' max='<?php echo date('Y-m-d');?>' id="year" class="rounded-lg px-2 w-full"></input>
                    <div class="mt-2">Location:</div>
                    <input type='text' name='location' id='location' placeholder="Use the search feature or click on the map" class="bg-white/40 rounded-lg px-2 w-full"></input>
                </div>
                <div id="incident" class="hidden font-semibold text-base-content">
                    <div class="mt-2">Severity:</div>
                    <select id="type" name="severity" class="rounded-lg px-2 p-1 w-full">
                        <option disabled selected>--</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <div class="mt-2">What was the nature of the incident?</div>
                    <select id="type" name="nature" class="rounded-lg px-2 p-1 w-full">
                        <option disabled selected>--</option>
                        <option value="theft">Theft</option>
                        <option value="accident">Traffic Accident</option>
                        <option value="altercation">Altercation</option>
                        <option value="vandalism">Vandalism</option>
                        <option value="medical">Medical Emergency</option>
                        <option value="harassment">Harassment</option>
                        <option value="infrastructure">Broken Infrastructure</option>
                        <option value="other">Other (Please describe in text entry)</option>
                    </select>
                </div>
                <div id="general" class="hidden font-semibold text-base-content">
                    <div class="mt-2">Reason for Feedback:</div>
                    <select id="type" name="reason" class="rounded-lg px-2 p-1 w-full">
                        <option disabled selected>--</option>
                        <option value="lack of amenities">Lack of Amenities</option>
                        <option value="poor bus condition">Poor bus condition</option>
                        <option value="late arrival/departure">Late arrival/departure</option>
                        <option value="bus too full">Bus too full to accept passengers</option>
                        <option value="overcrowding">Overcrowding on bus</option>
                        <option value="accessibility">Accessibility issues</option>
                        <option value="other">Other (Please describe in text entry)</option>
                    </select>
                </div>
                <div id="toSubmit" class="hidden flex flex-row items-center justify-evenly font-bold gap-2 mt-4">
                    <button type="reset" value="Reset" class="px-2 p-1 basis-1/2 rounded-lg hover:bg-green-700/50 bg-[#448b5c]/50">Reset</button>
                    <button type='submit' value='Submit' name='submit' onClick="return validation()" class="px-2 p-1 basis-1/2 rounded-lg hover:bg-green-700/50 bg-[#448b5c]/50">Submit</button>
                </div>		
            </div>
        </form>
        <div class="bg-white/60 p-4 mt-5 rounded-lg">
        <div class="text-3xl md:text-3xl font-bold font-sans text-green-700/50 mb-2">Disclaimer</div>
            <p class=" text-sm text-slate-900/90">
            Thank you for providing feedback through this form. 
            </br>Please note that while we value your input, the information collected may be used 
            for data analysis or other purposes, and may not result in immediate action to 
            address reported issues. 
            </br>For assistance with urgent matters or to report immediate concerns, please use the following resources: 
            </br><a href="https://go-rts.com/customer-service-lost-found/" class="font-semibold text-green-700/50 underline">GO-RTS Customer Service</a>
            </br><a href="https://www.gainesvillefl.gov/Government-Pages/Government/Departments/Transportation/RTS" class="font-semibold text-green-700/50 underline">Gainesville Transportation Dept.</a>
            </br>In the case of police, fire or medical emergency,<div class="text-green-700/50 font-semibold text-sm">call 911.</div>
            </p>
        </div>
    </div>
    <div class="flex-1 mr-8 mb-8">
        <div id="map" class="w-full ml-4 m-auto rounded-lg"></div>
    </div> 
</div>